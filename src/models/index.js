import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);

import config from '../configs/config.js';

console.log({
  'database': config.database,
  'username': config.username,
  'password': config.password,
  'host': config.host,
  'dialect': config.dialect,
});

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
    },
);
const db = {
  sequelize,
  Sequelize,
};

const files = [];

fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) &&
          (file !== basename) &&
          (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      files.push(file);
    });

(async () => {
  try {
    await files.forEach(async (file) => {
      const modelModule = await import(path.join(__dirname, file));
      const model = modelModule.default(
          sequelize,
      );
      model.sync();
      db[model.name] = model;
    });

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        console.log('==============');
        console.log(modelName);
        console.log('==============');
        db[modelName].associate(db);
      }
    });
  } catch (error) {
    console.error(error);
  }
})();

export default db;
