import express from 'express';
import { ExampleController } from '@apis/example/example.controller';
import { Validation } from '@apis/middlewares/validator.middleware';
import { ICreateExampleRequest } from '@biz/example/example.dto';

const router = express.Router();

router.post(
  '/',
  Validation.body(ICreateExampleRequest),
  ExampleController.create,
);

export default router;
