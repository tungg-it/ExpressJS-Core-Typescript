import { HttpCode } from '@enums/index';
import { APIError } from './api.error';
import httpStatus from 'http-status';

export class CustomError {
  static CustomMessage(message: string, errorCode?: HttpCode, stack?: string) {
    return new APIError({
      message,
      errorCode: errorCode ?? HttpCode.BAD_REQUEST,
      status: errorCode ? errorCode : httpStatus.BAD_REQUEST,
      stack: !stack ? new Error(message).stack || '' : stack,
    });
  }
}
