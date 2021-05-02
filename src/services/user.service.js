import axios from 'axios';
import sequelize from 'sequelize';
const {Op} = sequelize;

import Models from '../models/index.js';

const {User, UserLocation} = Models;

const validateNickname = (nickname) => {
  if (!nickname || nickname.length > 10) {
    throw new Error(`닉네임은 10글자까지입니다.`);
  }
};

const validateGender = (gender) => {
  if (!gender || (gender != 'M' && gender != 'F')) {
    throw new Error(`gender 필드는 'M'과 'F' 값 중 하나여야 합니다.`);
  }
};

const validateBirthdayYear = (birthdayYear) => {
  birthdayYear = String(birthdayYear);
  if (!birthdayYear || birthdayYear.length != 4) {
    throw new Error(`birthdayYear 필드는 4자리 년도 형식이어야 합니다.`);
  }

  const birthdayYearInt = parseInt(birthdayYear, 10);
  const nowYear = new Date().getFullYear();

  if (birthdayYearInt > nowYear) {
    throw new Error(`birthdayYear 필드는 현재 년도보다 작거나 같아야 합니다.`);
  }
};

const validateImageUrl = (imageUrl) => {
  if (!imageUrl) {
    throw new Error(`imageUrl 필드가 존재하지 않습니다.`);
  }
};

const validateLocation = (location) => {
  if (!location) {
    throw new Error(`위치 필드가 존재하지 않습니다.`);
  }
};

export const signUp = async (
    snsId,
    snsType,
    nickname,
    birthdayYear,
    gender,
    imageUrl,
) => {
  validateNickname(nickname);
  validateGender(gender);
  validateBirthdayYear(birthdayYear);

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
  validateNickname(nickname);
  validateGender(gender);
  validateBirthdayYear(birthdayYear);
  validateImageUrl(imageUrl);
  validateLocation(location);

  user.gender = gender;

  const birthdayDate = new Date(birthdayYearInt, 0, 1, 0, 0, 0, 0);
  user.birthday = birthdayDate;

  user.imageUrl = imageUrl;

  const {latitude, longitude} = location;

  const t = await sequelize.transaction();

  try {
    if (user.hasLocation() === false) {
      user.dataValues.location = await user.createUserLocation({
        longitude,
        latitude,
      }, {transaction: t});
    } else {
      user.location.latitude = latitude;
      user.location.longitude = longitude;
      await user.location.save({transaction: t});
    }

    const saveUser = await user.save({transaction: t});

    await t.commit();

    return saveUser;
  } catch (error) {
    await t.rollback();
  }
};

export const isCreatableNickname = async (nickname) => {
  validateNickname(nickname);

  const getUserByNickname = await User.findOne({
    attributes: ['id'],
    where: {
      nickname: {
        [Op.eq]: nickname,
      },
    },
  });

  if (getUserByNickname !== null) {
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
        as: 'location',
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
        as: 'location',
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

export const getAddressFromLocation = async (location) => {
  const {longitude, latitude} = location;

  const {data} = await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?input_coord=WGS84&output_coord=WGS84&x=${longitude}&y=${latitude}`,
      {
        headers: {
          'Authorization': `KakaoAK ${process.env.KAKAO_MAP_REST_API}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
  );
  const addressName = data.documents[1].address_name;
  return addressName;
};

export default {
  signUp,
  editProfile,
  isCreatableNickname,
  getUserBySnsAuth,
  getUserById,
  createUserBySnsAuth,
  getAddressFromLocation,
};
