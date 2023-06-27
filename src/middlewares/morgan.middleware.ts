import morgan from 'morgan';
import Logger from '../helpers/logger';
import config from '@configs/configuration';

const logger = Logger();

// Create listen stream
const stream = {
  write: (message) => logger.http(message),
};

// Support fo development config
const skip = () => {
  const env = config.env || 'development';
  return env !== 'development';
};

// Define format
const format =
  ':remote-addr :method :url :status :res[content-length] - :response-time ms';

// Create morgan middleware
const morganMiddleware = morgan(format, { stream, skip });

export default morganMiddleware;
