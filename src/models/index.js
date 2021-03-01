export {sequelize} from './sequelize.js';

import User from './User.js';
import UserLocation from './UserLocation.js';
import UserToken from './UserToken.js';
import CounselingQuestion from './CounselingQuestion.js';

const models = {
  User,
  UserLocation,
  UserToken,
  CounselingQuestion,
};

Object.keys(models).forEach((model) => {
  models[model].associate(models);
});

export default models;
