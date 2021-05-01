import userService from '../services/user.service.js';
import {Success, Failure} from '../utils/response.js';

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
    const jsonResult = Success(createUser);
    jsonResult.data.dataValues.birthday = `${birthdayYear}-01-01`;

    // 토큰 정보를 같이 넣어줍니다.
    const tokens = await jsonwebtoken.createToken(
        createUser.id,
        req.snsId,
        req.snsType,
    );
    jsonResult.data.dataValues.token = tokens;

    res.status(200).json(jsonResult);
  } catch (error) {
    res.status(200).json(Failure(error));
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const getUser = await userService.getUserById(req.user.id);

    res.status(200).json(Success(getUser));
  } catch (error) {
    res.status(200).json(Failure(error));
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
    const jsonResult = Success(updateUser);
    jsonResult.data.dataValues.birthday = `${birthdayYear}-01-01`;

    res.status(200).json(jsonResult);
  } catch (error) {
    res.status(200).json(Failure(error));
  }
};

export const postCheckNickname = async (req, res, next) => {
  const {nickname} = req.body;

  try {
    const isExistedNickname = await userService.isCreatableNickname(nickname);

    if (isExistedNickname === false) {
      return res.status(200).json(Success(false));
    }

    res.status(200).json(Success(true));
  } catch (error) {
    res.status(400).json(Failure(error));
  }
};

export const getAddressFromLocation = async (req, res, next) => {
  const userLocation = req.user.userLocation;

  if (userLocation == null) {
    return res.status(400).json(Failure('현재 위치를 설정해 주세요.'));
  }

  try {
    const addressString = await userService.getAddressFromLocation(
        userLocation,
    );
    return res.status(200).json(Success(addressString));
  } catch (err) {
    return res.status(400).json(Failure('위치 조회에 실패했습니다.'));
  }
};

export default {
  postSignUp,
  getMyProfile,
  patchMyProfile,
  postCheckNickname,
  getAddressFromLocation,
};
