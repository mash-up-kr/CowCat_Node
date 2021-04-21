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
  question.location = coordinates;
  return question;
};

export const getQuestions = async (
    user,
    minKilometerInteger,
    maxKilometerInteger,
    category,
    emotion,
) => {
  const userLatitude = user.userLocation.latitude;
  const userLongitude = user.userLocation.longitude;

  // 1km : 0.012 이므로 정수형 km 으로 받은 단위를 변환합니다.
  minKilometerInteger *= 0.012;
  maxKilometerInteger *= 0.012;

  const conditions = [
    sequelize.where(
        sequelize.fn(
            'ST_Distance',
            sequelize.col('location'),
            sequelize.fn('POINT', userLatitude, userLongitude),
        ),
        {
          [Op.gte]: minKilometerInteger,
          [Op.lte]: maxKilometerInteger,
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
              sequelize.fn('POINT', userLatitude, userLongitude),
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
            sequelize.fn('POINT', userLatitude, userLongitude),
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
    question.location = coordinates;

    // 1km : 0.012 이므로, km 단위로 보내주기 위해 나누고, 소수점 세 자리까지 출력합니다.
    question.dataValues.distance /= 0.012;
    question.dataValues.distance =
      Math.round(question.dataValues.distance * 1000.0) / 1000.0;
  });
  return questions;
};

export const getQuestion = async (questionId) => {
  const question = await CounselingQuestion.findOne({
    attributes: ['id', 'title', 'content', 'category', 'emotion', 'location'],
    where: {id: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'imageUrl'],
      },
    ],
  });
  const coordinates = {
    latitude: question.location.coordinates[0],
    longitude: question.location.coordinates[1],
  };
  question.location = coordinates;
  return question;
};

export const putQuestion = async (
    user,
    questionId,
    title,
    content,
    category,
    emotion,
) => {
  const updateQuestions = await CounselingQuestion.update(
      {
        title,
        content,
        category,
        emotion,
      },
      {
        where: {
          id: questionId,
          userId: user.id,
        },
      },
  );
  return updateQuestions;
};

export const deleteQuestion = async (user, questionId) => {
  const questions = await CounselingQuestion.destroy({
    where: {id: questionId, userId: user.id},
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
    question.location = coordinates;
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
