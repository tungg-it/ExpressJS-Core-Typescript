import express, { Response, Request } from 'express';

const rootRouter = express.Router();

rootRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello api!!');
});

export default rootRouter;
