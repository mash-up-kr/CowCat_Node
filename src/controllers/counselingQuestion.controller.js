import questionService from '../services/counselingQuestion.service.js';
import {Success, Failure} from '../utils/response.js';
// import {redisDefault, getAsyncReadonly} from '../redis.js';

export const postQuestion = async (req, res, next) => {
  const {title, content, categoryId, emotionId, userId} = req.body;

  if (typeof title !== 'string' || typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (title.length > 20) {
    return res.status(200).json(Failure('고민 제목은 최대 20자 입니다.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('고민 내용은 최대 200자 입니다.'));
  }
  if (categoryId === null) {
    return res.status(200).json(Failure('고민 카테고리를 선택해주세요.'));
  }
  if (emotionId === null) {
    return res.status(200).json(Failure('현재 기분을 선택해주세요.'));
  }

  try {
    const questions = await questionService.postQuestion({
      title,
      content,
      categoryId,
      emotionId,
      userId,
    });
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestions({});
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const getQuestion = async (req, res, next) => {
  const {questionId} = req.params;

  try {
    const questions = await questionService.getQuestion({
      questionId,
    });
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const putQuestion = async (req, res, next) => {
  const {title, content, categoryId, emotionId, userId} = req.body;
  const {questionId} = req.params;

  if (typeof title !== 'string' || typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (title.length > 20) {
    return res.status(200).json(Failure('고민 제목은 최대 20자 입니다.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('고민 내용은 최대 200자 입니다.'));
  }
  if (categoryId === null) {
    return res.status(200).json(Failure('고민 카테고리를 선택해주세요.'));
  }
  if (emotionId === null) {
    return res.status(200).json(Failure('현재 기분을 선택해주세요.'));
  }

  try {
    const questions = await questionService.putQuestion({
      questionId,
      title,
      content,
      categoryId,
      emotionId,
      userId,
    });
    if (questions === 0) {
      return res.status(200).json(Failure('존재하지 않는 고민입니다.'));
    }
    return res
        .status(201)
        .json(Success(await questionService.getQuestion({questionId})));
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  try {
    const resultCode = await questionService.deleteQuestion({
      questionId,
    });
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 고민입니다.'));
    }
    return res
        .status(201)
        .json(Success({id: questionId}));
  } catch (err) {
    next(err);
  }
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
};
