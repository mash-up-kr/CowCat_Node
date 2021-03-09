import models from '../models/index.js';

const { User, CounselingComment, CounselingQuestion } = models;

export const postComment = async ({ questionId, content, userId }) => {
  const result = await CounselingComment.create({
    content,
    counseling_question_id: questionId,
    user_id: userId,
  });
  return result;
};

export const getComments = async ({ questionId }) => {
  const result = await CounselingComment.findAll({
    where: { counseling_question_id: questionId },
  });
  return result;
};

export const getComment = async ({ commentId }) => {
  const result = await CounselingComment.findOne({
    where: { id: commentId },
  });
  console.log(result);
  return result;
};

export const putComment = async ({ commentId, content }) => {
  const [result] = await CounselingComment.update(
    {
      content,
    },
    { where: { id: commentId } }
  );
  return result;
};

export const deleteComment = async ({ commentId }) => {
  const result = await CounselingComment.destroy({
    where: { id: commentId },
  });
  return result;
};

export default {
  postComment,
  getComments,
  getComment,
  putComment,
  deleteComment,
};
