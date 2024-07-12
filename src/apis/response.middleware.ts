import e, { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import httpStatus from 'http-status';

import config from '@configs/configuration';
import { APIError } from '@errors/api.error';
import { HttpCode } from '@enums/index';
import Logger from '@helpers/logger';

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
      errorCode = HttpCode.INTERNAL_SERVER_ERROR,
    } = err;

    const response = {
      error_code: errorCode,
      message: err.message ? err.message : httpStatus[status],
      stack: err.stack,
      errors: err.errors,
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
    if (err instanceof ValidationError) {
      convertedError = new APIError({
        message: ResponseMiddleware.getMessageOfValidationError(err),
        status: httpStatus.BAD_REQUEST,
        errors: err.details,
        stack: err.error,
        errorCode: HttpCode.OK,
      });
    } else if (err instanceof APIError) {
      convertedError = err;
    } else {
      convertedError = new APIError({
        message: err.message,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        stack: err.stack,
        errorCode: HttpCode.INTERNAL_SERVER_ERROR,
      });
    }
    // log error for status >= 500
    if (convertedError.status >= httpStatus.INTERNAL_SERVER_ERROR) {
      ResponseMiddleware.logger.error('Process request error:', err);
    }

    return ResponseMiddleware.handler(convertedError, req, res, next);
  }

  static getMessageOfValidationError(error: ValidationError): string {
    try {
      const details = error.details;
      if (
        details.body !== undefined &&
        details.body !== null &&
        details.body.length > 0
      ) {
        return details.body[0].message;
      } else if (
        details.query !== undefined &&
        details.query !== null &&
        details.query.length > 0
      ) {
        return details.query[0].message;
      } else if (
        details.params !== undefined &&
        details.params !== null &&
        details.params.length > 0
      ) {
        return details.params[0].message;
      } else if (
        details.headers !== undefined &&
        details.headers !== null &&
        details.headers.length > 0
      ) {
        return details.headers[0].message;
      }
    } catch (error) {
      ResponseMiddleware.logger.error(
        'Error during get message from ValidationError',
        error,
      );
    }
    return 'common.validate_fail';
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
