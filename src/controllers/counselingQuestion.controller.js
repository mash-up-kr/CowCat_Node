import counselingQuestionService from
  '../services/counselingQuestion.service.js';
import questionService from '../services/counselingQuestion.service.js';
import {Success, Failure} from '../utils/response.js';

export const postQuestion = async (req, res, next) => {
  const userId = req.user.id;
  const {
    title,
    content,
    categoryId,
    emotionId,
    latitude,
    longitude,
  } = req.body;

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
    const questions = await questionService.postQuestion(
        title,
        content,
        categoryId,
        emotionId,
        userId,
        latitude,
        longitude,
    );
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  const {
    minKilometer,
    maxKilometer,
    categoryId,
    emotionId,
  } = req.body;

  try {
    const questions = await questionService.getQuestions(
        req.user,
        minKilometer,
        maxKilometer,
        categoryId,
        emotionId,
    );
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const getQuestion = async (req, res, next) => {
  const {questionId} = req.params;

  try {
    const questions = await questionService.getQuestion(
        questionId,
    );
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const putQuestion = async (req, res, next) => {
  const userId = req.user.id;
  const {questionId} = req.params;
  const {
    title,
    content,
    categoryId,
    emotionId,
  } = req.body;

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
    const questions = await questionService.putQuestion(
        questionId,
        title,
        content,
        categoryId,
        emotionId,
        userId,
    );
    if (questions === 0) {
      return res.status(200).json(Failure('존재하지 않는 고민입니다.'));
    }

    const getQuestion = await questionService.getQuestion(questionId);
    return res.status(201).json(Success(getQuestion));
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  try {
    const resultCode = await questionService.deleteQuestion(
        questionId,
    );
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 고민입니다.'));
    }
    return res
        .status(201)
        .json(Success({id: questionId}));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await counselingQuestionService.getCategories();

    return res.status(200).json(Success(categories));
  } catch (err) {
    next(err);
  }
};

export const getEmotions = async (req, res, next) => {
  try {
    const emotions = await counselingQuestionService.getEmotions();

    return res.status(200).json(Success(emotions));
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
  getCategories,
  getEmotions,
};
