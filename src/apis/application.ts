import { ExpressServer } from '@apis/server';
import config from '@configs/configuration';
import Logger from '@helpers/logger';

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */
export class Application {
  private static logger = Logger();

  public static async createApplication(): Promise<ExpressServer> {
    const expressServer = new ExpressServer();
    await expressServer.setup(config.port);
    Application.handleExit(expressServer);

    return expressServer;
  }

  /**
   * Register signal handler to graceful shutdown
   *
   * @param express Express server
   */
  private static handleExit(express: ExpressServer) {
    process.on('uncaughtException', (err: unknown) => {
      Application.logger.error('Uncaught exception', err);
      Application.shutdownProperly(1, express);
    });
    process.on('unhandledRejection', (reason: unknown | null | undefined) => {
      Application.logger.error('Unhandled Rejection at promise', reason);
      Application.shutdownProperly(2, express);
    });
    process.on('SIGINT', () => {
      Application.logger.info('Caught SIGINT, exiting!');
      Application.shutdownProperly(128 + 2, express);
    });
    process.on('SIGTERM', () => {
      Application.logger.info('Caught SIGTERM, exiting');
      Application.shutdownProperly(128 + 2, express);
    });
    process.on('exit', () => {
      Application.logger.info('Exiting process...');
    });
  }

  /**
   * Handle graceful shutdown
   *
   * @param exitCode
   * @param express
   */
  private static shutdownProperly(exitCode: number, express: ExpressServer) {
    Promise.resolve()
      .then(() => express.kill())
      .then(() => {
        Application.logger.info('Shutdown complete, bye bye!');
        process.exit(exitCode);
      })
      .catch((err) => {
        Application.logger.error('Error during shutdown', err);
        process.exit(1);
      });
  }
}
