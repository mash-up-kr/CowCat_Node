// import countryService from '../services/user.service.js';
// import {Success, Failure} from '../utils/response.js';
// import {redisDefault, getAsyncReadonly} from '../redis.js';

export const postComment = async (req, res, next) => {
  const { questionId } = req.params;
  res.send('postComment OK - ' + 'questionID: ' + questionId);
};

export const getComments = async (req, res, next) => {
  const { questionId } = req.params;
  res.send('getComments OK - ' + 'questionID: ' + questionId);
};

export const putComment = async (req, res, next) => {
  const { questionId, commentId } = req.params;
  res.send(
    'putComment OK - ' +
      'questionID: ' +
      questionId +
      ', commentId: ' +
      commentId
  );
};

export const deleteComment = async (req, res, next) => {
  const { questionId, commentId } = req.params;
  res.send(
    'deleteComment OK - ' +
      'questionID: ' +
      questionId +
      ', commentId: ' +
      commentId
  );
};

export default {
  postComment,
  getComments,
  putComment,
  deleteComment,
};
