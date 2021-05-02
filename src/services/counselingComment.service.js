import sequelize from 'sequelize';
import models from '../models/index.js';
import enums from '../models/data/enums.js';

const {CounselingComment, CounselingQuestion, User, CommentLike} = models;

const ONE_DAY_SEC = 24 * 60 * 60 * 1000;

const validateContent = (content) => {
  if (typeof content !== 'string') {
    throw new Error('문자열을 입력해주세요.');
  }

  if (content.length > 200) {
    throw new Error('답변 내용은 최대 200자 입니다.');
  }
};

const validateCommentWriter = (comment) => {
  if (comment.userId !== userId) {
    throw new Error('답변 작성자가 아닙니다.');
  }
};

export const postComment = async ({questionId, content, userId}) => {
  validateContent(content);
  const result = await CounselingComment.create({
    content,
    counselingQuestionId: questionId,
    userId: userId,
  });
  return result;
};

export const getComments = async ({questionId, userId}) => {
  const comments = await CounselingComment.findAll({
    where: {counselingQuestionId: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname'],
      },
    ],
  });
  await setCommentLikeInfo(comments, userId);
  await setIsNew(comments);
  return comments;
};

export const getComment = async ({commentId}) => {
  const comment = await CounselingComment.findOne({
    where: {id: commentId},
  });
  await setCommentLikeInfo([comment]);
  await setIsNew([comment]);
  return [comment];
};

export const putComment = async ({comment, content, userId}) => {
  validateContent(content);
  validateCommentWriter(comment);

  const [result] = await CounselingComment.update(
      {
        content,
      },
      {
        where: {
          id: comment.id,
          userId,
        },
      },
  );
  return result;
};

export const deleteComment = async ({comment, userId}) => {
  validateCommentWriter(comment);
  const result = await CounselingComment.destroy({
    where: {
      id: comment.id,
      userId,
    },
  });
  return result;
};

export const getCommentsByUserId = async (userId) => {
  const comments = await CounselingComment.findAll({
    where: {userId},
    attributes: {
      include: [[sequelize.col('counselingQuestion.category'), 'category']],
      exclude: [
        'counselingQuestionId',
        'userId',
        'updatedAt',
        'deletedAt',
      ],
    },
    include: [
      {
        model: CounselingQuestion,
        as: 'counselingQuestion',
        required: true,
        attributes: [
          'id',
          'title',
          'createdAt',
        ],
      },
    ],
    order: ['id'],
  });
  await setCommentLikeInfo(comments, userId);
  await setIsNew(comments);

  const result = {};
  enums.category.forEach((key) => (result[key] = []));
  comments.forEach((comment) => {
    result[comment.dataValues.category].push(comment);
  });
  return result;
};

export const postCommnerLike = async (userId, counselingCommentId) => {
  const comment = await CommentLike.create({
    userId,
    counselingCommentId,
  });
  return comment;
};

export const deleteCommnerLike = async (userId, counselingCommentId) => {
  await CommentLike.destroy({
    where: {userId, counselingCommentId},
  });
};

export const setCommentLikeInfo = async (comments, userId) => {
  const commentIdx = new Map();

  for (let i = 0; i < comments.length; i++) {
    comments[i].dataValues.likeCount = 0;
    comments[i].dataValues.liked = false;
    commentIdx.set(comments[i].id, i);
  }
  console.log(commentIdx);
  const likeCounts = await CommentLike.findAll({
    where: {counselingCommentId: [...commentIdx.keys()]},
    attributes: [
      ['counseling_comment_id', 'commentId'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'likeCount'],
    ],
    group: ['counseling_comment_id'],
  });

  const commentsLikedByUser = await CommentLike.findAll({
    where: {counselingCommentId: [...commentIdx.keys()], userId},
  });

  likeCounts.forEach((v) => {
    const idx = commentIdx.get(v.dataValues.commentId);
    const likeCnt = v.dataValues.likeCount;
    comments[idx].dataValues.likeCount = likeCnt;
  });

  commentsLikedByUser.forEach((v) => {
    const idx = commentIdx.get(v.dataValues.counselingCommentId);
    comments[idx].dataValues.liked = true;
  });
};

export const setIsNew = async (comments) => {
  const now = new Date();
  comments.forEach((comment) => {
    console.log(comment);

    const targetTime = new Date(comment.dataValues.createdAt);
    // 24시간 기준으로 판별
    if (now - targetTime <= ONE_DAY_SEC) {
      comment.dataValues.isNew = true;
    } else {
      comment.dataValues.isNew = false;
    }
  });
};

export default {
  postComment,
  getComments,
  getComment,
  putComment,
  deleteComment,
  getCommentsByUserId,
  postCommnerLike,
  deleteCommnerLike,
};
