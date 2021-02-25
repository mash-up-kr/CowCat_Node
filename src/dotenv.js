import path from 'path';
import dotenv from 'dotenv';

export const initializeDotEnv = () => {
  const __dirname = path.resolve();
  const options = {};

  if (process.env.NODE_ENV === 'production') {
    options.path = path.join(__dirname, '.env.production');
  } else if (process.env.NODE_ENV === 'test') {
    options.path = path.join(__dirname, '.env.test');
  } else if (process.env.NODE_ENV === 'development' ||
                process.env.NODE_ENV === undefined) {
    options.path = path.join(__dirname, '.env.development');
  } else {
    throw new Error('process.env.NODE_ENV를 올바르게 설정해주세요!');
  }

  dotenv.config(options);
};
