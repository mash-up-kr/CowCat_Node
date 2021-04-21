/* eslint-disable max-len */
import questionService from '../services/counselingQuestion.service.js';
import {Success, Failure} from '../utils/response.js';
import enums from '../models/data/enums.js';

export const postQuestion = async (req, res, next) => {
  const userId = req.user.id;
  const {title, content, category, emotion, latitude, longitude} = req.body;

  if (typeof title !== 'string' || typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (title.length > 20) {
    return res.status(200).json(Failure('고민 제목은 최대 20자 입니다.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('고민 내용은 최대 200자 입니다.'));
  }
  if (!enums.category.includes(category)) {
    return res
        .status(200)
        .json(Failure('고민 카테고리 값을 확인해주세요. : ' + enums.category));
  }
  if (!enums.emotion.includes(emotion)) {
    return res
        .status(200)
        .json(Failure('감정의 값을 확인해주세요. : ' + enums.emotion));
  }

  try {
    const createQuestion = await questionService.postQuestion(
        title,
        content,
        category,
        emotion,
        userId,
        latitude,
        longitude,
    );

    const coordinates = createQuestion.dataValues.location.coordinates;
    createQuestion.dataValues.location = coordinates;

    return res.status(201).json(Success(createQuestion));
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  const {minKilometer, maxKilometer, category, emotion} = req.query;

  if (category != null && !enums.category.includes(category)) {
    return res
        .status(200)
        .json(Failure('고민 카테고리 값을 확인해주세요. : ' + enums.category));
  }
  if (emotion != null && !enums.emotion.includes(emotion)) {
    return res
        .status(200)
        .json(Failure('감정의 값을 확인해주세요. : ' + enums.emotion));
  }
  if (!req.user.userLocation) {
    return res.status(200).json(Failure('User의 위치값이 없습니다.'));
  }

  try {
    const questions = await questionService.getQuestions(
        req.user,
        minKilometer,
        maxKilometer,
        category,
        emotion,
    );
    return res.status(201).json(Success(questions));
  } catch (err) {
    next(err);
  }
};

export const getQuestion = async (req, res, next) => {
  const {questionId} = req.params;

  try {
    const question = await questionService.getQuestion(questionId);
    // const { dataValues } = await getUserById(question.userId);
    // question.dataValues.user = dataValues;
    return res.status(201).json(Success(question));
  } catch (err) {
    next(err);
  }
};

export const putQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  const {title, content, category, emotion} = req.body;

  if (typeof title !== 'string' || typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (title.length > 20) {
    return res.status(200).json(Failure('고민 제목은 최대 20자 입니다.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('고민 내용은 최대 200자 입니다.'));
  }
  if (category != null && !enums.category.includes(category)) {
    return res
        .status(200)
        .json(Failure('고민 카테고리 값을 확인해주세요. : ' + enums.category));
  }
  if (emotion != null && !enums.emotion.includes(emotion)) {
    return res
        .status(200)
        .json(Failure('감정의 값을 확인해주세요. : ' + enums.emotion));
  }

  try {
    const questions = await questionService.putQuestion(
        req.user,
        questionId,
        title,
        content,
        category,
        emotion,
    );

    if (questions[0] === 0) {
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
    const resultCode = await questionService.deleteQuestion(questionId);
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 고민입니다.'));
    }
    return res.status(201).json(Success({id: questionId}));
  } catch (err) {
    next(err);
  }
};

export const getMyQuestions = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const questions = await questionService.getMyQuestions(userId);
    return res.status(201).json(Success(questions));
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
  getMyQuestions,
};
