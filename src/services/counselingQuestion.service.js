import sequelize from 'sequelize';
import enums from '../models/data/enums.js';
import models from '../models/index.js';

const {CounselingQuestion, CounselingComment, User, QuestionLike} = models;
const {Op} = sequelize;

const ONE_DAY_SEC = 24 * 60 * 60 * 1000;

const validateTitle = (title) => {
  if (typeof title !== 'string') {
    throw new Error('문자열을 입력해주세요.');
  }

  if (title.length > 20 || title.length < 1) {
    throw new Error('고민 제목은 최소 1자 이상 최대 20자 입니다.');
  }
};

const validateContent = (content) => {
  if (typeof content !== 'string') {
    throw new Error('문자열을 입력해주세요.');
  }

  if (content.length > 200 || content.length < 1) {
    throw new Error('고민 내용은 최소 1자 이상 최대 200자 입니다.');
  }
};

const validateCategory = (category) => {
  if (!enums.category.includes(category)) {
    throw new Error(`고민 카테고리 값을 확인해주세요. : ${enums.category}`);
  }
};

const validateEmotion = (emotion) => {
  if (!enums.emotion.includes(emotion)) {
    throw new Error(`기분 값을 확인해주세요. : ${enums.emotion}`);
  }
};

const validateLocation = (latitude, longitude) => {
  if (!latitude || !longitude) {
    throw new Error(
        `위치 정보 값을 확인해주세요. : (latitude: ${latitude}, longitude: ${longitude})`,
    );
  }
};

export const postQuestion = async (
    title,
    content,
    category,
    emotion,
    userId,
    latitude,
    longitude,
) => {
  validateTitle(title);
  validateContent(content);
  validateCategory(category);
  validateEmotion(emotion);
  validateLocation(latitude, longitude);

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
    limit,
) => {
  if (category) {
    validateCategory(category);
  }

  if (emotion) {
    validateEmotion(emotion);
  }

  const userLatitude = user.location.latitude;
  const userLongitude = user.location.longitude;

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
        [
          sequelize.fn('COUNT', sequelize.col('counselingComment.id')),
          'commentCount',
        ],
      ],
    },
    where: {
      [Op.and]: conditions,
    },
    include: [
      {
        model: CounselingComment,
        as: 'counselingComment',
        required: false,
        attributes: [],
      },
    ],
    group: ['id'],
    order: [[sequelize.fn('RAND')]],
    limit,
    subQuery: false,
  });

  await setQuestionLikeInfo(questions, user.id);
  await setIsNew(questions);

  questions.forEach((question) => {
    if (question.id != null) {
      const coordinates = {
        latitude: question.location.coordinates[0],
        longitude: question.location.coordinates[1],
      };
      question.location = coordinates;
    }

    // 1km : 0.012 이므로, km 단위로 보내주기 위해 나누고, 소수점 세 자리까지 출력합니다.
    question.dataValues.distance /= 0.012;
    question.dataValues.distance =
      Math.round(question.dataValues.distance * 1000.0) / 1000.0;
  });
  return questions;
};

export const getQuestion = async (questionId, user) => {
  const userId = user.id;
  const userLatitude = user.location.latitude;
  const userLongitude = user.location.longitude;

  const question = await CounselingQuestion.findOne({
    attributes: [
      'id',
      'title',
      'content',
      'category',
      'emotion',
      'location',
      [
        sequelize.fn(
            'ST_Distance',
            sequelize.col('location'),
            sequelize.fn('POINT', userLatitude, userLongitude),
        ),
        'distance',
      ],
      [
        sequelize.fn('COUNT', sequelize.col('counselingComment.id')),
        'commentCount',
      ],
    ],
    where: {id: questionId},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'imageUrl'],
      },
      {
        model: CounselingComment,
        as: 'counselingComment',
        required: false,
        attributes: [],
      },
    ],
  });
  if (question.id != null) {
    const coordinates = {
      latitude: question.location.coordinates[0],
      longitude: question.location.coordinates[1],
    };
    question.location = coordinates;

    question.dataValues.distance /= 0.012;
    question.dataValues.distance =
      Math.round(question.dataValues.distance * 1000.0) / 1000.0;
  }

  await setQuestionLikeInfo([question], userId);
  await setIsNew([question]);

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
  validateTitle(title);
  validateContent(content);
  validateCategory(category);
  validateEmotion(emotion);

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
    where: {
      id: questionId,
      userId: user.id,
    },
  });

  await CounselingComment.destroy({
    where: {
      counselingQuestionId: questionId,
    },
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

  await setQuestionLikeInfo(questions, userId);
  await setIsNew(questions);

  const result = {};
  enums.category.forEach((key) => (result[key] = []));

  questions.forEach((question) => {
    if (question.id != null) {
      const coordinates = {
        latitude: question.location.coordinates[0],
        longitude: question.location.coordinates[1],
      };
      question.location = coordinates;
      result[question.dataValues.category].push(question);
    }
  });

  return result;
};

export const postQuestionLike = async (userId, counselingQuestionId) => {
  const question = await QuestionLike.create({
    userId,
    counselingQuestionId,
  });
  return question;
};

export const deleteQuestionLike = async (userId, counselingQuestionId) => {
  const question = await QuestionLike.destroy({
    where: {userId, counselingQuestionId},
  });
  return question;
};

export const setQuestionLikeInfo = async (questions, userId) => {
  const questionIdx = new Map();

  for (let i = 0; i < questions.length; i++) {
    questions[i].dataValues.likeCount = 0;
    questions[i].dataValues.liked = false;
    questionIdx.set(questions[i].id, i);
  }

  const likeCounts = await QuestionLike.findAll({
    where: {counselingQuestionId: [...questionIdx.keys()]},
    attributes: [
      ['counseling_question_id', 'questionId'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'likeCount'],
    ],
    group: ['counseling_question_id'],
  });

  const questionsLikedByUser = await QuestionLike.findAll({
    where: {counselingQuestionId: [...questionIdx.keys()], userId},
  });

  likeCounts.forEach((v) => {
    const idx = questionIdx.get(v.dataValues.questionId);
    const likeCnt = v.dataValues.likeCount;
    questions[idx].dataValues.likeCount = likeCnt;
  });

  questionsLikedByUser.forEach((v) => {
    const idx = questionIdx.get(v.dataValues.counselingQuestionId);
    questions[idx].dataValues.liked = true;
  });
};

export const setIsNew = async (questions) => {
  const now = new Date();
  questions.forEach((question) => {
    console.log(question);

    const targetTime = new Date(question.dataValues.createdAt);
    // 24시간 기준으로 판별
    if (now - targetTime <= ONE_DAY_SEC) {
      question.dataValues.isNew = true;
    } else {
      question.dataValues.isNew = false;
    }
  });
};

export default {
  postQuestion,
  getQuestion,
  getQuestions,
  putQuestion,
  deleteQuestion,
  getMyQuestions,
  postQuestionLike,
  deleteQuestionLike,
};
