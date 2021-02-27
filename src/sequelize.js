import db from './models/index.js';

export default class SequelizeInitializer {
  constructor() {
  }

  sync() {
    const syncOptions = this.getSyncOption();
    return db.sequelize.sync(syncOptions);
  }

  getSyncOption() {
    const syncOptions = {};
    if (process.env.NODE_ENV === 'test') {
      syncOptions.force = true;
    }
    return syncOptions;
  }
}
