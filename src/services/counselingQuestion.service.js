import sequelize from 'sequelize';
import CounselingComment from '../models/CounselingComment.js';
import enums from '../models/data/enums.js';
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
  const question = await CounselingQuestion.create({
    title,
    content,
    category,
    emotion,
    userId,
    location: sequelize.fn('POINT', point.coordinates),
  });
  const coordinates = {
    latitude: question.location.args[0][0],
    longitude: question.location.args[0][1],
  };
  question.location = {
    type: 'Point',
    coordinates,
  };
  return question;
};

export const getQuestions = async (
    user,
    minKilometer,
    maxKilometer,
    category,
    emotion,
) => {
  const lat = user.userLocation.latitude;
  const long = user.userLocation.longitude;
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
  questions.forEach((question) => {
    const coordinates = {
      latitude: question.location.coordinates[0],
      longitude: question.location.coordinates[1],
    };
    question.location.coordinates = coordinates;
  });
  return questions;
};

export const getQuestion = async (questionId) => {
  const question = await CounselingQuestion.findOne({
    where: {id: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname'],
      },
    ],
  });
  const coordinates = {
    latitude: question.location.coordinates[0],
    longitude: question.location.coordinates[1],
  };
  question.location.coordinates = coordinates;
  return question;
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

export const getMyQuestions = async (userId) => {
  const questions = await CounselingQuestion.findAll({
    where: {userId},
    attributes: {
      include: [
        [
          sequelize.fn('COUNT', sequelize.col('counselingComment.id')),
          'commentCount',
        ],
      ],
    },
    include: [
      {
        model: CounselingComment,
        as: 'counselingComment',
        required: false,
        attributes: [],
      },
    ],
    order: ['id'],
    group: ['id'],
  });
  const result = {};
  enums.category.forEach((key) => (result[key] = []));
  questions.forEach((question) => {
    const coordinates = {
      latitude: question.location.coordinates[0],
      longitude: question.location.coordinates[1],
    };
    question.location.coordinates = coordinates;
    result[question.dataValues.category].push(question);
  });
  return result;
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
  getMyQuestions,
};
