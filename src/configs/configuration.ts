import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env?.ENV ?? 'development',
  port: Number(process.env?.PORT ?? 8080),
  prefix: process.env?.PREFIX ?? 'api',
  database: {
    url: process.env?.DB_URL ?? '',
  },
};

export default config;
