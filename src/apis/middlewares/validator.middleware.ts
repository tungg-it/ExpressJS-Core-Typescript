import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpCode } from '@enums/index';
import { CustomValidatorError } from '@errors/api.error';

export class Validation {
  public static body<T>(dto: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const instance = plainToInstance(dto, req.body) as object;
        const errors = await validate(instance);

        if (errors.length > 0) {
          throw new CustomValidatorError({
            status: HttpCode.BAD_REQUEST,
            errors,
            errorCode: 1,
          });
        }

        req.body = instance;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
