import winston from 'winston';
import config from '@configs/configuration';

const Logger = () => {
  // Define levers for winston
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  // Add level to winston
  const level = () => {
    const environment = config.environment || 'development';
    const isDevelopment = environment === 'development';
    return isDevelopment ? 'debug' : 'warn';
  };

  // Define colors for winston
  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  };

  // Add color to winston
  winston.addColors(colors);

  // Custom format for log printf
  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
      const { level, timestamp, message, stack } = info;
      const noError = `[${level}] [${timestamp}] ${message}`;
      const error = `[${level}] [${timestamp}] ${message} \n${stack}`;
      const result = stack ? error : noError;
      return result;
    }),
  );

  // Define file log for error
  const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // Write all logs
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ];

  // Create Log
  return winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
  });
};

export default Logger;
