import { HttpCode } from '@enums/index';
import { errors } from 'express-validation';

interface APIErrorParams {
  message: string;
  errors?: Error | errors;
  stack?: string;
  errorCode: number;
  status?: number;
  isPublic?: boolean;
  messageData?: object | null;
}

/**
 * Class representing an API error.
 * @extends APIError
 */
export class APIError extends Error {
  public status: number;
  public errorCode: number;
  public isPublic: boolean;
  public errors?: Error | errors;
  // eslint-disable-next-line @typescript-eslint/ban-types
  public messageData?: object | null;

  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param errs
   * @param stack
   * @param errorCode
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param isRawMessage
   */
  constructor({
    message,
    errors: errs,
    stack,
    errorCode,
    status = HttpCode.INTERNAL_SERVER_ERROR,
    isPublic = false,
    messageData = null,
  }: APIErrorParams) {
    super(message);
    this.stack = stack;
    this.status = status;
    this.isPublic = isPublic;
    this.errors = errs;
    if (errorCode === 0) {
      this.errorCode =
        status >= 500 ? HttpCode.INTERNAL_SERVER_ERROR : HttpCode.OK;
    } else {
      this.errorCode = errorCode;
    }
    this.messageData = messageData;
  }
}
