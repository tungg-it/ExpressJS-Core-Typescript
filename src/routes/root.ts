import express, { Request } from 'express';
import { Res } from '@type/express';

const rootRouter = express.Router();

rootRouter.get('/', (req: Request, res: Res) => {
  res.send(res.t('hello'));
});

export default rootRouter;
