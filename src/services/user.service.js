import sequelize from 'sequelize';
const {Op} = sequelize;

import Models from '../models/index.js';

const {User, UserLocation} = Models;

export const signUp = async (
    snsId,
    snsType,
    nickname,
    birthdayYear,
    gender,
    imageUrl,
) => {
  if (gender != 'M' && gender != 'F') {
    throw new Error(`gender 필드는 'M'과 'F' 값 중 하나여야 합니다.`);
  }

  if (birthdayYear.length != 4) {
    throw new Error(`birthdayYear 필드는 4자리 년도 형식이어야 합니다.`);
  }

  const birthdayYearInt = parseInt(birthdayYear, 10);
  const nowYear = new Date().getFullYear();

  if (birthdayYearInt > nowYear) {
    throw new Error(`birthdayYear 필드는 현재 년도보다 작거나 같아야 합니다.`);
  }

  const birthdayDate = new Date(birthdayYearInt, 0, 1, 0, 0, 0, 0);

  const createUser = await User.create({
    snsId,
    snsType,
    nickname,
    birthday: birthdayDate,
    gender,
    imageUrl,
  });

  return createUser;
};

export const getProfile = async () => {

};

export const editProfile = async () => {

};

export const updateRefreshToken = async () => {

};

export const isExistedNickname = async (nickname) => {
  const getNicknameUser = await User.findOne({
    attributes: [
      'nickname',
    ],
  });

  if (getNicknameUser === null) {
    return false;
  }

  return true;
};

export const getUserBySnsAuth = async (snsId, snsType) => {
  const getUser = await User.findOne({
    attributes: [
      'id',
      'snsId',
      'snsType',
      'nickname',
      'birthday',
      'gender',
      'imageUrl',
    ],
    where: {
      'snsId': {
        [Op.eq]: snsId,
      },
      'snsType': {
        [Op.eq]: snsType,
      },
    },
    include: [
      {
        model: UserLocation,
        as: 'Location',
        required: false,
      },
    ],
  });

  return getUser;
};

export const getUserById = async (userId) => {
  const getUser = await User.findOne({
    attributes: [
      'id',
      'snsId',
      'snsType',
      'nickname',
      'birthday',
      'gender',
      'imageUrl',
    ],
    where: {
      'id': {
        [Op.eq]: userId,
      },
    },
    include: [
      {
        model: UserLocation,
        as: 'Location',
        required: false,
      },
    ],
  });

  return getUser;
};

export const createUserBySnsAuth = async (snsId, snsType) => {
  const createUser = await User.create({
    snsId,
    snsType,
  });

  return createUser;
};

export default {
  signUp,
  getProfile,
  editProfile,
  updateRefreshToken,
  isExistedNickname,
  getUserBySnsAuth,
  getUserById,
  createUserBySnsAuth,
};
