import express, { Application } from 'express';
import cors from 'cors';

import morganMiddleware from '@middlewares/morgan.middleware';
import Logger from '@helpers/logger';
import config from '@configs/configuration';
import rootRouter from '@routes/root';
import constants from '@constants/constants';
import i18nMiddleware from '@middlewares/i18n.middleware';

const app: Application = express();
const host: string = config.host;
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

// i18n config
app.use(constants.i18n.init);
app.use(i18nMiddleware);

// Router config
app.use(`/${prefix}`, rootRouter);

app.listen(port, host, async () => {
  logger.info(`Application listening at http://localhost:${port}/${prefix}`);
});
