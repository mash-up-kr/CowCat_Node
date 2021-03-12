// import countryService from '../services/user.service.js';
// import {Success, Failure} from '../utils/response.js';
// import {redisDefault, getAsyncReadonly} from '../redis.js';

export const postQuestion = async (req, res, next) => {
  res.send('postQuestion OK');
};

export const getQuestions = async (req, res, next) => {
  res.send('getQuestions OK');
};

export const getQuestion = async (req, res, netx) => {
  const {questionId} = req.params;
  res.send('getQuestion OK: ' + questionId);
};

export const putQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  res.send('putQuestion OK: ' + questionId);
};

export const deleteQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  res.send('deleteQuestion OK: ' + questionId);
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
};
