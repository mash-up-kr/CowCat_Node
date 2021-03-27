import axios from 'axios';
import jsonwebtoken from '../auth/jsonwebtoken.js';

import userService from '../services/user.service.js';
import {Success, Failure} from '../utils/response.js';

export const getKakaoCallback = async (req, res, next) => {
  // https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/api/v1/auth/kakao/callback&client_id=37bd0311edf6745360da88d2d959d4a3
  // https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=https://api.cowcat.live/api/v1/auth/kakao/callback&client_id=37bd0311edf6745360da88d2d959d4a3
  const {code} = req.query;

  const params = new URLSearchParams();
  params.append('code', `${code}`);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', process.env.KAKAO_REDIRECT_URI);
  params.append('client_secret', process.env.KAKAO_SECRET_KEY);
  params.append('client_id', process.env.KAKAO_REST_API_KEY);

  try {
    const result = await axios.post(`https://kauth.kakao.com/oauth/token`,
        params, {
          headers: {
            'Content-Type': `application/x-www-form-urlencoded`,
          },
        });

    const {access_token: accessToken} = result.data;

    res.status(200).json(Success(accessToken));
  } catch (err) {
    res.status(200).json(Failure(err));
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const getUser = await userService.getUserBySnsAuth(req.snsId, req.snsType);

    if (getUser == null) {
      res.status(200).json(Failure('해당하는 계정이 없습니다.'));
      return;
    }

    const jsonResult = Success(getUser);

    // 토큰 정보를 같이 넣어줍니다.
    const tokens = await jsonwebtoken.createToken(
        getUser.id,
        req.snsId,
        req.snsType,
    );
    jsonResult.data.dataValues.token = tokens;

    res.status(200).json(jsonResult);
  } catch (err) {
    res.status(200).json(Failure('토큰이 만료되었습니다.'));
  }
};

export const postRefreshToken = async (req, res, next) => {
  try {
    const getUser = await userService.getUserBySnsAuth(req.snsId, req.snsType);

    if (getUser === null) {
      throw new Error();
    }

    const accessToken = await jsonwebtoken.createAccessToken(req.user.id);

    res.status(200).json(Success(accessToken));
  } catch (error) {
    res.status(200).json(Failure('토큰이 일치하지 않습니다.'));
  }
};

export default {
  getKakaoCallback,
  postLogin,
  postRefreshToken,
};
