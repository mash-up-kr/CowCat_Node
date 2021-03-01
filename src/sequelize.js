import {sequelize} from './models/index.js';

export default class SequelizeInitializer {
  constructor() {
  }

  sync() {
    const syncOptions = this.getSyncOption();
    return sequelize.sync(syncOptions);
  }

  getSyncOption() {
    const syncOptions = {};
    if (process.env.NODE_ENV === 'test') {
      syncOptions.force = true;
    } else if (process.env.NODE_ENV === 'development') {
      syncOptions.alter = true;
    }
    return syncOptions;
  }
}
