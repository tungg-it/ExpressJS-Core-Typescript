import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import config from '@configs/configuration';
import { APIError, CustomValidatorError } from '@errors/api.error';
import Logger from '@helpers/logger';
import { HttpCode } from '@enums/index';

export class ResponseMiddleware {
  /**
   * Handle error
   * @param err APIError
   * @param req
   * @param res
   * @param next
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      convertedError = new APIError({
        message: 'Validator error',
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
