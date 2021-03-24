export {sequelize} from './sequelize.js';

import User from './User.js';
import UserLocation from './UserLocation.js';

import Category from './Category.js';
import Emotion from './Emotion.js';
import CounselingQuestion from './CounselingQuestion.js';
import CounselingComment from './CounselingComment.js';

const models = {
  User,
  UserLocation,

  Category,
  Emotion,
  CounselingQuestion,
  CounselingComment,
};

Object.keys(models).forEach((model) => {
  models[model].associate(models);
});

export default models;
