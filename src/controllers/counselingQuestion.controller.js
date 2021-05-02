import questionService from '../services/counselingQuestion.service.js';
import {Success, Failure, UnExpectedError} from '../utils/response.js';

export const postQuestion = async (req, res, next) => {
  const userId = req.user.id;
  const {title, content, category, emotion, latitude, longitude} = req.body;

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

    return res.status(201).json(
        Success(
            createQuestion,
            'SUCCESS_CREATE_COUNSELING_QUESTION',
            '성공적으로 고민을 등록했습니다.',
        ),
    );
  } catch (error) {
    res.status(400).json(Failure(error.message, 'INVALID_PARAMETER', -1));
  }
};

export const getQuestions = async (req, res, next) => {
  const {minKilometer, maxKilometer, category, emotion, limit} = req.query;

  const location = req.user.location;

  if (location == null) {
    return res.status(400).json(
        Failure('현재 위치를 설정해 주세요.', 'NOT_FOUND_LOCATION', -1));
  }

  console.log(category);
  try {
    const questions = await questionService.getQuestions(
        req.user,
        minKilometer,
        maxKilometer,
        category,
        emotion,
        isNaN(limit) ? undefined : Number(limit),
    );
    return res.status(200).json(
        Success(
            questions,
            'SUCCESS_GET_COUNSELING_QUESTIONS',
            '성공적으로 고민 목록을 조회했습니다.',
        ),
    );
  } catch (error) {
    if (error.name === 'Error') {
      return res.status(400).json(
          Failure(error.message, 'INVALID_PARAMETER', -1),
      );
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const getQuestion = async (req, res, next) => {
  const {questionId} = req.params;

  const location = req.user.location;

  if (location == null) {
    return res.status(400).json(
        Failure('현재 위치를 설정해 주세요.', 'NOT_FOUND_LOCATION', -1));
  }

  try {
    const question = await questionService.getQuestion(questionId, req.user);

    if (question.id === null) {
      return res.status(400).json(
          Failure('존재하지 않는 고민입니다.', 'NOT_FOUND_COUNSELING_QUESTION', -1),
      );
    }

    return res.status(200).json(
        Success(
            question,
            'SUCCESS_GET_COUNSELING_QUESTION',
            '성공적으로 고민 게시글을 조회했습니다.',
        ),
    );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const putQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  const {title, content, category, emotion} = req.body;
  x;
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
      return res.status(400).json(
          Failure('존재하지 않는 고민입니다.', 'NOT_FOUND_COUNSELING_QUESTION', -1),
      );
    }

    const getQuestion = await questionService.getQuestion(questionId, req.user);
    return res.status(200).json(Success(
        getQuestion,
        'SUCCESS_EDIT_QUESTION',
        '성공적으로 고민을 수정했습니다.',
    ));
  } catch (error) {
    if (error.name === 'Error') {
      return res.status(400).json(
          Failure(error.message, 'INVALID_PARAMETER', -1),
      );
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const deleteQuestion = async (req, res, next) => {
  const {questionId} = req.params;
  try {
    const resultCode = await questionService.deleteQuestion(
        req.user,
        questionId,
    );
    if (resultCode === 0) {
      return res.status(400).json(
          Failure('존재하지 않는 고민입니다.', 'NOT_FOUND_COUNSELING_QUESTION', -1),
      );
    }
    return res.status(200).json(
        Success(
            true,
            'SUCCESS_DELETE_COUNSELING_QUESTION',
            '성공적으로 게시글을 삭제했습니다.',
        ),
    );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const getMyQuestions = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const questions = await questionService.getMyQuestions(userId);
    return res.status(200).json(
        Success(
            questions,
            'SUCCESS_GET_MY_COUNSELING_QUESTION',
            '성공적으로 내 고민 목록을 조회했습니다.',
        ),
    );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const postQuestionLike = async (req, res, next) => {
  const {questionId} = req.params;
  const userId = req.user.id;
  try {
    await questionService.postQuestionLike(userId, questionId);
    return res.status(201).json(
        Success(
            true,
            'SUCCESS_CREATE_COUNSELING_QUESTION_LIKE',
            '성공적으로 고민 좋아요를 눌렀습니다.',
        ),
    );
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(201).json(
          Success(
              true,
              'SUCCESS_CREATE_COUNSELING_QUESTION_LIKE',
              '성공적으로 고민 좋아요를 눌렀습니다.',
          ),
      );
    }

    return res.status(400).json(UnExpectedError(error));
  }
};

export const deleteQuestionLike = async (req, res, next) => {
  const {questionId} = req.params;
  const userId = req.user.id;
  try {
    await questionService.deleteQuestionLike(userId, questionId);
    return res.status(200).json(
        Success(
            true,
            'SUCCESS_DELETE_COUNSELING_QUESTION_LIKE',
            '성공적으로 고민 좋아요를 취소했습니다.',
        ),
    );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
  getMyQuestions,
  postQuestionLike,
  deleteQuestionLike,
};
