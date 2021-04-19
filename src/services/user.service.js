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

  birthdayYear = String(birthdayYear);
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
    imageUrl: imageUrl || '',
  });

  return createUser;
};

export const editProfile = async (
    user,
    nickname,
    gender,
    birthdayYear,
    imageUrl,
    location,
) => {
  if (nickname !== null) {
    user.nickname = nickname;
  }

  if (gender !== null) {
    if (gender != 'M' && gender != 'F') {
      throw new Error(`gender 필드는 'M'과 'F' 값 중 하나여야 합니다.`);
    }

    user.gender = gender;
  }

  if (birthdayYear !== null) {
    birthdayYear = String(birthdayYear);

    if (birthdayYear.length != 4) {
      throw new Error(`birthdayYear 필드는 4자리 년도 형식이어야 합니다.`);
    }

    const birthdayYearInt = parseInt(birthdayYear, 10);
    const nowYear = new Date().getFullYear();

    if (birthdayYearInt > nowYear) {
      throw new Error(
          `birthdayYear 필드는 현재 년도보다 작거나 같아야 합니다.`,
      );
    }

    const birthdayDate = new Date(birthdayYearInt, 0, 1, 0, 0, 0, 0);
    user.birthday = birthdayDate;
  }

  if (imageUrl !== null) {
    user.imageUrl = imageUrl;
  }
  if (location !== null) {
    const {latitude, longitude} = location;

    if (user.Location === null) {
      user.dataValues.userLocation = await user.createLocation({
        longitude,
        latitude,
      });
    } else {
      user.dataValues.userLocation.latitude = latitude;
      user.dataValues.userLocation.longitude = longitude;
    }
  }

  const saveUser = await user.save();
  return saveUser;
};

export const isCreatableNickname = async (nickname) => {
  if (nickname === '' || nickname === null) {
    return false;
  }

  const getNicknameUser = await User.findOne({
    attributes: ['id'],
    where: {
      nickname: {
        [Op.eq]: nickname,
      },
    },
  });

  if (getNicknameUser !== null) {
    // 닉네임 생성 불가능
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
      snsId: {
        [Op.eq]: snsId,
      },
      snsType: {
        [Op.eq]: snsType,
      },
    },
    include: [
      {
        model: UserLocation,
        as: 'userLocation',
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
      id: {
        [Op.eq]: userId,
      },
    },
    include: [
      {
        model: UserLocation,
        as: 'userLocation',
        required: false,
        attributes: ['id', 'latitude', 'longitude'],
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
  editProfile,
  isCreatableNickname,
  getUserBySnsAuth,
  getUserById,
  createUserBySnsAuth,
};
