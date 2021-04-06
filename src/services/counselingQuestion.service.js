import sequelize from 'sequelize';
const {Op} = sequelize;

import models from '../models/index.js';

const {CounselingQuestion} = models;

export const postQuestion = async (
    title,
    content,
    categoryId,
    emotionId,
    userId,
    latitude,
    longitude,
) => {
  var point = {
    type: 'Point',
    coordinates: [latitude,longitude],
    //crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  };
  const questions = await CounselingQuestion.create({
    title,
    content,
    category_id: categoryId,
    emotion_id: emotionId,
    user_id: userId,
    latitude,
    longitude,
    location: sequelize.fn('POINT', point.coordinates),
  });
  return questions;
};

export const getQuestions = async (
  user,
  minKilometer,
  maxKilometer,
  categoryId,
  emotionId,
) => {
  const lat = user.Location.latitude;
  const long = user.Location.longitude;
  
  const questions = await CounselingQuestion.findAll({
    attributes: {
      include:[[
        sequelize.fn('ST_Distance',
          sequelize.col('location'),
          sequelize.fn('POINT', lat, long),
        ),
        'distance'
      ]],
    },
    order: [[
      sequelize.fn('ST_Distance',
        sequelize.col('location'),
        sequelize.fn('POINT', lat, long)
      ),
      'ASC'
    ]],
    where: {
      [Op.and]: [
        {
          emotion_id: emotionId
        },
        {
          category_id: categoryId
        },
        sequelize.where(sequelize.fn('ST_Distance',
          sequelize.col('location'),
          sequelize.fn('POINT', lat, long)
        ),
        {
          [Op.gte]: minKilometer,
          [Op.lte]: maxKilometer
        })
      ]
    }
  });

  console.log(questions);
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
