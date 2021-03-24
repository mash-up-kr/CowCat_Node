import models from '../models/index.js';

const {CounselingQuestion} = models;

export const postQuestion = async (
    title,
    content,
    categoryId,
    emotionId,
    userId,
) => {
  const questions = await CounselingQuestion.create({
    title,
    content,
    category_id: categoryId,
    emotion_id: emotionId,
    user_id: userId,
  });
  return questions;
};

export const getQuestions = async () => {
  const questions = await CounselingQuestion.findAll();
  return questions;
};

export const getQuestion = async (questionId) => {
  const questions = await CounselingQuestion.findOne({
    where: {id: questionId},
  });
  console.log(questions);
  return questions;
};

export const putQuestion = async (
    questionId,
    title,
    content,
    categoryId,
    emotionId,
    userId,
) => {
  const questions = await CounselingQuestion.update({
    title,
    content,
    categoryId,
    emotionId,
    userId,
  },
  {
    where: {id: questionId},
  });
  console.log(questions);
  return questions;
};

export const deleteQuestion = async (questionId) => {
  const questions = await CounselingQuestion.destroy({
    where: {id: questionId},
  });
  return questions;
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
};
