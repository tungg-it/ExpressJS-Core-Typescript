import { Application } from '@apis/application';
import Logger from '@helpers/logger';

/**
 * Entrypoint for bootstrapping and starting the application.
 * Might configure aspects like logging, telemetry, memory leak observation or even orchestration before.
 * This is about to come later!
 */

Application.createApplication().then(() => {
  const logger = Logger();
  logger.info('The api was started successfully!');
});
