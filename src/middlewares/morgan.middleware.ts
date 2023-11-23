import morgan from 'morgan';
import Logger from '@helpers/logger';
import config from '@configs/configuration';

const logger = Logger();

// Create listen stream
const stream = {
  write: (message) => logger.http(message),
};

// Support fo development config
const skip = () => {
  const environment = config.environment || 'development';
  return environment !== 'development';
};

// Define format
const format =
  '[:method] HOST::remote-addr PATH::url CODE::status +:response-time ms';

// Create morgan middleware
const morganMiddleware = morgan(format, { stream, skip });

export default morganMiddleware;
