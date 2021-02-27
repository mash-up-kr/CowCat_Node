import path from 'path';
import dotenv from 'dotenv';

import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  dotenv.config({path: path.join(__dirname, '../../.env.production')});
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({path: path.join(__dirname, '../../.env.test')});
} else if (process.env.NODE_ENV === 'development' ||
              process.env.NODE_ENV === undefined) {
  dotenv.config({path: path.join(__dirname, '../../.env.development')});
} else {
  throw new Error('process.env.NODE_ENV를 올바르게 설정해주세요!');
}

export default {
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'cowcat',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  dialect: process.env.DATABASE_DIALECT || 'mysql',
  connectTimeout: Number(process.env.DATABASE_CONNECT_TIMEOUT || 1000),
};
