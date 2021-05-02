import commentService from '../services/counselingComment.service.js';
import {Success, Failure, UnExpectedError} from '../utils/response.js';

export const postComment = async (req, res, next) => {
  const {questionId} = req.params;
  const {content} = req.body;
  const userId = req.user.id;

  try {
    const result = await commentService.postComment({
      questionId: parseInt(questionId),
      content,
      userId,
    });
    return res
        .status(201)
        .json(
            Success(
                result,
                'SUCCESS_CREATE_COMMENT',
                '성공적으로 답변을 등록했습니다.',
            ),
        );
  } catch (error) {
    if (error.name === 'Error') {
      return res
          .status(400)
          .json(Failure(error.message, 'INVALID_PARAMETER', -1));
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const getComments = async (req, res, next) => {
  const {questionId} = req.params;
  const userId = req.user.id;

  try {
    const comments = await commentService.getComments({
      questionId: parseInt(questionId),
      userId,
    });
    return res
        .status(200)
        .json(
            Success(
                comments,
                'SUCCESS_GET_COMMENTS',
                '성공적으로 답변 목록을 조회했습니다.',
            ),
        );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const putComment = async (req, res, next) => {
  const {commentId} = req.params;
  const {content} = req.body;
  const userId = req.user.id;

  try {
    let comment = await commentService.getComment({commentId, userId});

    if (comment === null) {
      return res
          .status(400)
          .json(Failure('존재하지 않는 답변입니다.', 'NOT_FOUND_COMMENT', -1));
    }

    await commentService.putComment({
      comment,
      content,
      userId,
    });

    comment = await commentService.getComment({commentId, userId});
    return res
        .status(200)
        .json(
            Success(
                comment,
                'SUCCESS_EDIT_COMMENT',
                '성공적으로 답변을 수정했습니다.',
            ),
        );
  } catch (error) {
    if (error.name === 'Error') {
      return res
          .status(400)
          .json(Failure(error.message, 'INVALID_PARAMETER', -1));
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const deleteComment = async (req, res, next) => {
  const {commentId} = req.params;
  const userId = req.user.id;
  const comment = await commentService.getComment({commentId, userId});

  if (comment === null) {
    return res
        .status(400)
        .json(Failure('존재하지 않는 답변입니다.', 'NOT_FOUND_COMMENT', -1));
  }

  try {
    const resultCode = await commentService.deleteComment({
      comment,
      userId,
    });
    if (resultCode === 0) {
      return res
          .status(400)
          .json(Failure('존재하지 않는 답변입니다.', 'NOT_FOUND_COMMENT', -1));
    }
    return res
        .status(200)
        .json(
            Success(
                true,
                'SUCCESS_DELETE_COMMENT',
                '성공적으로 답변을 삭제했습니다.',
            ),
        );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const getCommentsByUserId = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const comments = await commentService.getCommentsByUserId(userId);
    return res
        .status(200)
        .json(
            Success(
                comments,
                'SUCCESS_MY_COUNSELING_COMMENTS',
                '성공적으로 내 답변 목록을 조회했습니다.',
            ),
        );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export const postCommentLike = async (req, res, next) => {
  const {commentId} = req.params;
  const userId = req.user.id;
  try {
    await commentService.postCommentLike(userId, commentId);
    return res
        .status(201)
        .json(
            Success(
                true,
                'SUCCESS_CREATE_COUNSELING_COMMENT_LIKE',
                '성공적으로 답변 좋아요를 눌렀습니다.',
            ),
        );
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
          .status(201)
          .json(
              Success(
                  true,
                  'SUCCESS_CREATE_COUNSELING_COMMENT_LIKE',
                  '성공적으로 고민 좋아요를 눌렀습니다.',
              ),
          );
    }

    return res.status(400).json(UnExpectedError(error));
  }
};

export const deleteCommentLike = async (req, res, next) => {
  const {commentId} = req.params;
  const userId = req.user.id;
  try {
    await commentService.deleteCommentLike(userId, commentId);
    return res
        .status(200)
        .json(
            Success(
                true,
                'SUCCESS_DELETE_COUNSELING_COMMENT_LIKE',
                '성공적으로 답변 좋아요를 취소했습니다.',
            ),
        );
  } catch (error) {
    return res.status(400).json(UnExpectedError(error));
  }
};

export default {
  postComment,
  getComments,
  putComment,
  deleteComment,
  getCommentsByUserId,
  postCommentLike,
  deleteCommentLike,
};
