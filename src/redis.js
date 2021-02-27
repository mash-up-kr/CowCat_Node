import Redis from 'ioredis';
import {promisify} from 'util';

export const redisDefault = new Redis(6379, process.env.REDIS_DEFAULT);
export const redisReadonly = new Redis(6379, process.env.REDIS_READONLY);

export const getAsyncDefault = promisify(redisDefault.get).bind(redisDefault);
export const getAsyncReadonly = promisify(redisReadonly.get).bind(redisReadonly);
