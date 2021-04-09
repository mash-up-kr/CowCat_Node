import commentService from '../services/counselingComment.service.js';
import {Success, Failure} from '../utils/response.js';
// import {redisDefault, getAsyncReadonly} from '../redis.js';

export const postComment = async (req, res, next) => {
  const {questionId} = req.params;
  const {content} = req.body;
  const userId = req.user.id;

  if (typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('200자를 초과했습니다.'));
  }
  try {
    const result = await commentService.postComment({
      questionId: parseInt(questionId),
      content,
      userId,
    });
    return res.status(201).json(Success(result));
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  const {questionId} = req.params;

  try {
    const result = await commentService.getComments({
      questionId: parseInt(questionId),
    });
    return res.status(201).json(Success(result));
  } catch (err) {
    next(err);
  }
};

export const putComment = async (req, res, next) => {
  const {commentId} = req.params;
  const {content} = req.body;
  const userId = req.user.id;
  const comment = await commentService.getComment({commentId});

  if (comment === null) {
    return res.status(200).json(Failure('코멘트가 존재하지 않습니다.'));
  }

  if (comment.user_id !== userId) {
    return res.status(200).json(Failure('코멘트 작성자가 아닙니다.'));
  }

  if (typeof content !== 'string') {
    return res.status(200).json(Failure('문자열을 입력해주세요.'));
  }
  if (content.length > 200) {
    return res.status(200).json(Failure('200자를 초과했습니다.'));
  }
  try {
    const resultCode = await commentService.putComment({
      commentId,
      content,
      userId,
    });
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 코멘트입니다.'));
    }

    const comment = await commentService.getComment({commentId});
    return res.status(201).json(Success(comment));
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  const {questionId, commentId} = req.params;
  const userId = req.user.id;
  const comment = await commentService.getComment({commentId});

  if (comment === null) {
    return res.status(200).json(Failure('코멘트가 존재하지 않습니다.'));
  }

  if (comment.user_id !== userId) {
    return res.status(200).json(Failure('코멘트 작성자가 아닙니다.'));
  }

  try {
    const resultCode = await commentService.deleteComment({
      commentId,
      userId,
    });
    if (resultCode === 0) {
      return res.status(200).json(Failure('존재하지 않는 코멘트입니다.'));
    }
    return res.status(201).json(
        Success({
          id: parseInt(commentId),
          counselingQuestionId: parseInt(questionId),
        }),
    );
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
