import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import config from '@configs/configuration';
import { APIError, CustomValidatorError } from '@errors/api.error';
import Logger from '@helpers/logger';
import { HttpCode } from '@enums/index';
import { ValidationError } from 'class-validator';

export class ResponseMiddleware {
  /**
   * Handle error
   * @param err APIError
   * @param req
   * @param res
   * @param next
   */

  private static logger = Logger();
  static handler(
    err: APIError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const {
      status = httpStatus.INTERNAL_SERVER_ERROR,
      errorCode = 1,
      messageData,
    } = err;

    const response = {
      error_code: errorCode,
      message: err.message ? err.message : httpStatus[status],
      errors: err.errors,
      stack: err.stack,
      messageData,
    };

    if (config.environment !== 'development') {
      delete response.stack;
      delete response.errors;
    }

    res.status(status);
    res.json(response);
    res.end();
    next();
  }

  /**
   * Convert error if it's not APIError
   * @param err
   * @param req
   * @param res
   * @param next
   */
  static converter(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    let convertedError: APIError;
    if (err instanceof CustomValidatorError) {
      let errorMessages = ['Validator error']; // Default message

      if (err.errors instanceof Array) {
        // If errors is an array, extract messages from ValidationErrors
        errorMessages = err.errors
          .filter((err) => err instanceof ValidationError)
          .map((err) => {
            if (err.constraints) {
              return Object.values(err.constraints)[0];
            }
            return '';
          })
          .filter(Boolean); // Remove any empty string;
      } else if (err.errors instanceof Error) {
        // If errors is a single Error object, use its message
        errorMessages = [err.errors.message];
      }

      convertedError = new APIError({
        message: errorMessages[0],
        status: err.status,
        stack: err.errors[0],
        errorCode: 1,
      });
    } else if (err instanceof APIError) {
      convertedError = err;
    } else {
      convertedError = new APIError({
        message: err.message,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        stack: err.stack,
        errorCode: 1,
      });
    }
    // log error for status >= 500
    if (convertedError.status >= httpStatus.INTERNAL_SERVER_ERROR) {
      ResponseMiddleware.logger.error('Process request error:', err);
    }

    return ResponseMiddleware.handler(convertedError, req, res, next);
  }

  /**
   * Notfound middleware
   * @param req
   * @param res
   * @param next
   */
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const err = new APIError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
      stack: '',
      errorCode: HttpCode.NOT_FOUND,
    });
    return ResponseMiddleware.handler(err, req, res, next);
  }
}
