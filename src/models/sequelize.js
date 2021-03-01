import Sequelize from 'sequelize';
import config from '../configs/database_config.js';

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export {sequelize};
export default db;
