import { NextFunction, Request, Response } from 'express';
import { ExampleBiz } from '@biz/example/example.biz';
import { ICreateExampleRequest } from '@biz/example/example.dto';

export class ExampleController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body: ICreateExampleRequest = req.body as ICreateExampleRequest;
      const result = await ExampleBiz.createExample(body);
      res.sendJson(result);
    } catch (error) {
      next(error);
    }
  }
}
