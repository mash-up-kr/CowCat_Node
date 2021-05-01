export {sequelize} from './sequelize.js';

import User from './User.js';
import UserLocation from './UserLocation.js';
import CounselingQuestion from './CounselingQuestion.js';
import CounselingComment from './CounselingComment.js';
import CommentLike from './CommentLike.js';
import QuestionLike from './QuestionLike.js';

const models = {
  User,
  UserLocation,
  CounselingQuestion,
  CounselingComment,
  QuestionLike,
  CommentLike,
};

Object.keys(models).forEach((model) => {
  models[model].associate(models);
});

export default models;
