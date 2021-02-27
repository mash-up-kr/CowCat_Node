import {initializeDotEnv} from './dotenv.js';
import ExpressServer from './app.js';
import SequelizeInitializer from './sequelize.js';

initializeDotEnv();

const expressServer = new ExpressServer();
const sequelizeInitializer = new SequelizeInitializer();

(async () => {
  try {
    await sequelizeInitializer.sync();
  
    process.on('SIGINT', () => {
      expressServer.enableDisableKeepAlive();
      expressServer.close();
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }

})();