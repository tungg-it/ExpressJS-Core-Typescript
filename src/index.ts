import express, { Application } from 'express';
import cors from 'cors';

import morganMiddleware from '@middlewares/morgan.middleware';
import Logger from '@helpers/logger';
import config from '@configs/configuration';
import rootRouter from '@routes/root';

const app: Application = express();
const port: number = config.port;
const prefix: string = config.prefix;
const logger = Logger();

// Plugins
app.use(morganMiddleware);
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// Router config
app.use(`/${prefix}`, rootRouter);

app.listen(port, async () => {
  logger.info(`Application listening at http://localhost:${port}/${prefix}`);
});
