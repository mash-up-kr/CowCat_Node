import {initializeDotEnv} from './dotenv.js';
import ExpressServer from './app.js';

initializeDotEnv();

export const expressServer = new ExpressServer();
