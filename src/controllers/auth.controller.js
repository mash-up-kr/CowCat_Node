import axios from 'axios';
import userService from '../services/user.service.js';
import {Success, Failure} from '../utils/response.js';

import jsonwebtoken from '../auth/jsonwebtoken.js';

export const getKakaoCallback = async (req, res, next) => {
  // https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/api/v1/auth/kakao/callback&client_id=37bd0311edf6745360da88d2d959d4a3
  const {code} = req.query;

  const params = new URLSearchParams();
  params.append('code', `${code}`);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', 'http://localhost:3000/api/v1/auth/kakao/callback');
  params.append('client_secret', 'oFAdMVKWttu9auyDWd9rA7SXKXq4z5Hw');
  params.append('client_id', '37bd0311edf6745360da88d2d959d4a3');

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
    const tokens = await jsonwebtoken.createToken(req.snsId, req.snsType);
    jsonResult.data.dataValues.token = tokens;

    res.status(200).json(jsonResult);
  } catch (err) {
    res.status(200).json(Failure('토큰이 만료되었습니다.'));
  }
};

export default {
  getKakaoCallback,
  postLogin,
};
