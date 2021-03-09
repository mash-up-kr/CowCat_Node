import commentService from '../services/counselingComment.service.js';
import { Success, Failure } from '../utils/response.js';
// import {redisDefault, getAsyncReadonly} from '../redis.js';

export const postComment = async (req, res, next) => {
  const { questionId } = req.params;
  const { content } = req.body;
  const { userId } = req;

  if (typeof content !== 'string')
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  if (content.length > 200)
    return res.status(200).json(Failure('200자를 초과했습니다.'));
  try {
    const result = await commentService.postComment({
      questionId,
      content,
      userId,
    });
    return res.status(201).json(Success(result));
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  const { questionId } = req.params;
  try {
    const result = await commentService.getComments({
      questionId,
    });
    return res.status(201).json(Success(result));
  } catch (err) {
    next(err);
  }
};

export const putComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (typeof content !== 'string')
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  if (content.length > 200)
    return res.status(200).json(Failure('200자를 초과했습니다.'));
  try {
    const resultCode = await commentService.putComment({
      commentId,
      content,
    });
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 코멘트입니다.'));
    }
    return res
      .status(201)
      .json(Success(await commentService.getComment({ commentId })));
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  const { questionId, commentId } = req.params;
  try {
    const resultCode = await commentService.deleteComment({
      commentId,
    });
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 코멘트입니다.'));
    }
    return res
      .status(201)
      .json(Success({ id: commentId, counselingQuestionId: questionId }));
  } catch (err) {
    next(err);
  }
};

export default {
  postComment,
  getComments,
  putComment,
  deleteComment,
};
