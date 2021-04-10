import sequelize from 'sequelize';
const {Op} = sequelize;

import models from '../models/index.js';
import User from '../models/User.js';

const {CounselingQuestion} = models;

export const postQuestion = async (
    title,
    content,
    category,
    emotion,
    userId,
    latitude,
    longitude,
) => {
  const point = {
    type: 'Point',
    coordinates: [latitude, longitude],
    //  crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  };
  const questions = await CounselingQuestion.create({
    title,
    content,
    category,
    emotion,
    userId,
    location: sequelize.fn('POINT', point.coordinates),
  });
  return questions;
};

export const getQuestions = async (
    user,
    minKilometer,
    maxKilometer,
    category,
    emotion,
) => {
  const lat = user.Location.latitude;
  const long = user.Location.longitude;
  const conditions = [
    sequelize.where(
        sequelize.fn(
            'ST_Distance',
            sequelize.col('location'),
            sequelize.fn('POINT', lat, long),
        ),
        {
          [Op.gte]: minKilometer,
          [Op.lte]: maxKilometer,
        },
    ),
  ];

  if (emotion) conditions.push({emotion});
  if (category) conditions.push({category});

  const questions = await CounselingQuestion.findAll({
    attributes: {
      include: [
        [
          sequelize.fn(
              'ST_Distance',
              sequelize.col('location'),
              sequelize.fn('POINT', lat, long),
          ),
          'distance',
        ],
      ],
    },
    order: [
      [
        sequelize.fn(
            'ST_Distance',
            sequelize.col('location'),
            sequelize.fn('POINT', lat, long),
        ),
        'ASC',
      ],
    ],
    where: {
      [Op.and]: conditions,
    },
  });
  return questions;
};

export const getQuestion = async (questionId) => {
  const questions = await CounselingQuestion.findOne({
    where: {id: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname'],
      },
    ],
  });
  return questions;
};

export const putQuestion = async (
    questionId,
    title,
    content,
    category,
    emotion,
    userId,
) => {
  const questions = await CounselingQuestion.update(
      {
        title,
        content,
        category,
        emotion,
        userId,
      },
      {
        where: {id: questionId},
      },
  );
  return questions;
};

export const deleteQuestion = async (questionId) => {
  const questions = await CounselingQuestion.destroy({
    where: {id: questionId},
  });
  return questions;
};

/* Deprecated
export const getCategories = async () => {
  const categories = await Category.findAll({
    attributes: ['id', 'key'],
    order: [['id', 'ASC']],
  });

  return categories;
};

export const getEmotions = async () => {
  const emotions = await Emotion.findAll({
    attributes: ['id', 'key'],
    order: [['id', 'ASC']],
  });

  return emotions;
};
*/

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
  //  getCategories,
  //  getEmotions,
};
