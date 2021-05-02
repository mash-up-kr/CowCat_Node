import userService from '../services/user.service.js';
import {Success, Failure, UnExpectedError} from '../utils/response.js';

import jsonwebtoken from '../auth/jsonwebtoken.js';


export const postSignUp = async (req, res, next) => {
  const {
    nickname,
    birthdayYear,
    gender,
    imageUrl,
  } = req.body;

  try {
    const createUser = await userService.signUp(
        req.snsId,
        req.snsType,
        nickname,
        birthdayYear,
        gender,
        imageUrl,
    );

    // 생일년도-01-01 으로 바꿔주기 위해 Json 결과를 조작합니다.
    const jsonResult = Success(
        createUser, 'SUCCESS_CREATE_ACCOUNT', '회원가입에 성공했습니다.',
    );
    jsonResult.data.dataValues.birthday = `${birthdayYear}-01-01`;

    // 토큰 정보를 같이 넣어줍니다.
    const tokens = await jsonwebtoken.createToken(
        createUser.id,
        req.snsId,
        req.snsType,
    );
    jsonResult.data.dataValues.token = tokens;

    res.status(201).json(jsonResult);
  } catch (error) {
    if (error.name === 'Error') {
      return res.status(400).json(
          Failure(error.message, 'INVALID_PARAMETER', -1),
      );
    }

    // Sequelize 오류 인 경우
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.errors[0].message === 'users.nickname must be unique') {
        return res.status(400).json(
            Failure('중복된 닉네임을 사용했습니다.', 'EXISTED_NICKNAME', -1),
        );
      }
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const getUser = await userService.getUserById(req.user.id);

    res.status(200).json(
        Success(getUser, 'SUCCESS_GET_MY_PROFILE', '성공적으로 내 프로필을 조회했습니다.'),
    );
  } catch (error) {
    res.status(400).json(UnExpectedError(error));
  }
};

export const patchMyProfile = async (req, res, next) => {
  const {
    nickname,
    gender,
    birthdayYear,
    imageUrl,
    location,
  } = req.body;

  try {
    const updateUser = await userService.editProfile(
        req.user,
        nickname ?? null,
        gender ?? null,
        birthdayYear ?? null,
        imageUrl ?? null,
        location ?? null,
    );

    // 생일년도-01-01 으로 바꿔주기 위해 Json 결과를 조작합니다.
    const jsonResult = Success(
        updateUser, 'SUCCESS_EDIT_PROFILE', '성공적으로 프로필을 수정했습니다.',
    );

    jsonResult.data.dataValues.birthday = `${birthdayYear}-01-01`;

    return res.status(200).json(jsonResult);
  } catch (error) {
    if (error.name === 'Error') {
      return res.status(400).json(
          Failure(error.message, 'INVALID_PARAMETER', -1),
      );
    }

    // Sequelize 오류 인 경우
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.errors[0].message === 'users.nickname must be unique') {
        return res.status(400).json(
            Failure('중복된 닉네임을 사용했습니다.', 'EXISTED_NICKNAME', -1),
        );
      }
    }

    res.status(400).json(UnExpectedError(error));
  }
};

export const postCheckNickname = async (req, res, next) => {
  const {nickname} = req.body;

  try {
    const isExistedNickname = await userService.isCreatableNickname(nickname);

    res.status(200).json(
        Success(
            isExistedNickname,
            'SUCCESS_CHECK_NICKNAME',
            '성공적으로 닉네임 중복 여부를 확인했습니다.',
        ),
    );
  } catch (error) {
    res.status(400).json(UnExpectedError(error));
  }
};

export const getAddressFromLocation = async (req, res, next) => {
  const location = req.user.location;

  if (location == null) {
    return res.status(400).json(
        Failure('현재 위치를 설정해 주세요.', 'NOT_FOUND_LOCATION', -1));
  }

  try {
    const addressString = await userService.getAddressFromLocation(
        location,
    );
    return res.status(200).json(
        Success(
            addressString,
            'SUCCESS_GET_ADDRESS_FROM_LOCATION',
            '성공적으로 주소를 조회했습니다.',
        ),
    );
  } catch (err) {
    return res.status(400).json(
        Failure('위치 조회에 실패했습니다.', 'FAILED_GET_ADDRESS_FROM_LOCATION'),
    );
  }
};

export default {
  postSignUp,
  getMyProfile,
  patchMyProfile,
  postCheckNickname,
  getAddressFromLocation,
};
