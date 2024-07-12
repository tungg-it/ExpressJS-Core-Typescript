import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'http';

import Logger from '@helpers/logger';
import config from '@configs/configuration';
import constants from '@constants/constants';
import morganMiddleware from '@apis/morgan.middleware';
import i18nMiddleware from '@apis/i18n.middleware';
import router from '@apis/router';
import { ResponseMiddleware } from './response.middleware';

express.response.sendJson = function (data: object) {
  return this.json({ error_code: 0, message: 'OK', data });
};

/**
 * Abstraction around the raw Express.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */
export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;
  private logger = Logger();

  public async setup(port: number): Promise<Express> {
    const server = express();
    this.setupCorsMiddlewares(server);
    this.setupStandardMiddlewares(server);
    this.setupSecurityMiddlewares(server);
    this.setupI18nMiddlewares(server);
    this.configureRoutes(server);
    this.setupErrorHandlers(server);

    this.httpServer = this.listen(server, port);
    this.server = server;
    return this.server;
  }

  public listen(server: Express, port: number): Server {
    this.logger.info(`Starting server on port ${port} (${config.environment})`);
    return server.listen(port);
  }

  public async kill(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  private setupSecurityMiddlewares(server: Express) {
    server.use(helmet());
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    server.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'unsafe-inline'"],
          scriptSrc: ["'unsafe-inline'", "'self'"],
        },
      }),
    );
  }

  private setupStandardMiddlewares(server: Express) {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(morganMiddleware);
  }

  private configureRoutes(server: Express) {
    server.use(router);
  }

  private setupCorsMiddlewares(server: Express) {
    server.use(
      cors({
        origin: '*',
        allowedHeaders: '*',
        exposedHeaders: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'],
      }),
    );
  }

  private setupI18nMiddlewares(server: Express) {
    server.use(constants.i18n.init);
    server.use(i18nMiddleware);
  }

  private setupErrorHandlers(server: Express) {
    // if error is not an instanceOf APIError, convert it.
    server.use(ResponseMiddleware.converter);

    // catch 404 and forward to error handler
    server.use(ResponseMiddleware.notFound);

    // error handler, send stacktrace only during development
    server.use(ResponseMiddleware.handler);
  }
}
