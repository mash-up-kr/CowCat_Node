import userService from '../services/user.service.js';
import {Success, Failure} from '../utils/response.js';
import {redisDefault, getAsyncReadonly} from '../redis.js';

import jsonwebtoken from '../auth/jsonwebtoken.js';

export const postSignUp = async (req, res, next) => {
  const {
    nickname,
    birthdayYear,
    gender,
    imageUrl,
  } = req.body;

  try {
    const user = await userService.signUp(
        req.snsId,
        req.snsType,
        nickname,
        birthdayYear,
        gender,
        imageUrl,
    );

    // 생일년도-01-01 으로 바꿔주기 위해 Json 결과를 조작합니다.
    const jsonResult = Success(user);
    jsonResult.data.dataValues.birthday = `${birthdayYear}-01-01`;

    // 토큰 정보를 같이 넣어줍니다.
    const tokens = await jsonwebtoken.createToken(req.snsId, req.snsType);
    jsonResult.data.dataValues.token = tokens;

    return res.status(200).json(jsonResult);
  } catch (error) {
    return res.status(200).json(Failure(error));
  }
};

export const getMyProfile = async (req, res, next) => {

};

export const putMyProfile = async (req, res, next) => {
  const {
    nickname,
    gender,
    birthdayYear,
    location,
  } = req.body;

  return Success(req.body);
};

export const postRefreshToken = async (req, res, next) => {

};

export const postCheckNickname = async (req, res, next) => {

};

export default {
  postSignUp,
  getMyProfile,
  putMyProfile,
  postRefreshToken,
  postCheckNickname,
};
