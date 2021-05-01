import sequelize from 'sequelize';
import models from '../models/index.js';
import enums from '../models/data/enums.js';

const {CounselingComment, CounselingQuestion, User, CommentLike} = models;

export const postComment = async ({questionId, content, userId}) => {
  const result = await CounselingComment.create({
    content,
    counselingQuestionId: questionId,
    userId: userId,
  });
  return result;
};

export const getComments = async ({questionId}) => {
  const result = await CounselingComment.findAll({
    where: {counselingQuestionId: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname'],
      },
    ],
  });
  return result;
};

export const getComment = async ({commentId}) => {
  const result = await CounselingComment.findOne({
    where: {id: commentId},
  });
  return result;
};

export const putComment = async ({commentId, content, userId}) => {
  const [result] = await CounselingComment.update(
      {
        content,
      },
      {
        where: {id: commentId, userId},
      },
  );
  return result;
};

export const deleteComment = async ({commentId, userId}) => {
  const result = await CounselingComment.destroy({
    where: {id: commentId, userId},
  });
  return result;
};

export const getCommentsByUserId = async (userId) => {
  const comments = await CounselingComment.findAll({
    where: {userId},
    attributes: {
      include: [[sequelize.col('counselingQuestion.category'), 'category']],
    },
    include: [
      {
        model: CounselingQuestion,
        as: 'counselingQuestion',
        required: true,
        attributes: [],
      },
    ],
    order: ['id'],
  });
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
