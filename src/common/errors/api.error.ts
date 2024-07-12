import { HttpCode } from '@enums/index';
import { ValidationError } from 'class-validator';
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

export class CustomValidatorError extends Error {
  public status: number;
  public errorCode: number;
  public errors?: ValidationError[] | Error | errors; // Updated type

  /**
   * Creates an API error.
   * @param {ValidationError[]} errors
   * @param errorCode
   * @param {number} status - HTTP status code of error.
   */

  constructor({
    errors: errs,
    errorCode,
    status,
  }: {
    errors: ValidationError[];
    errorCode: number;
    status: number;
  }) {
    if (
      Array.isArray(errs) &&
      errs.every((err) => err instanceof ValidationError)
    ) {
      super(errs.map((err) => err.constraints).join(', '));
      this.errors = errs;
    } else {
      // If not, use the original error message
      super('Validation error');
      this.errors = errs;
    }

    this.status = status;
    this.errorCode = errorCode;
  }
}
