import jwt from 'jsonwebtoken';
import axios from 'axios';
import {Failure} from '../utils/response.js';
import userService from '../services/user.service.js';

export const checkSNSAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  const {snsType} = req.body;
  let snsId;

  if (!accessToken) {
    res.status(200).json(Failure('해당하는 계정이 없습니다.'));
  }

  try {
    if (snsType === 'kakao') {
      const {data: snsData} = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: {
          'Authorization': `${accessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      snsId = snsData.id;
    }

    req.snsId = snsId;
    req.snsType = snsType;
    next();
  } catch (err) {
    res.status(200).json(Failure('토큰이 만료되었습니다.'));
  }
};


export const checkJWTAccessToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(200).json(
        Failure('토큰이 일치하지 않습니다.'),
    );
  }

  try {
    const parseToken = token.split('Bearer ')[1];
    const verifyingJWT = await jwt.verify(parseToken, process.env.SECRET_KEY);

    if (typeof verifyingJWT === 'object' && !('user' in verifyingJWT)) {
      return res.status(200).json(
          Failure('토큰이 일치하지 않습니다.'),
      );
    }

    if (!verifyingJWT.user.id) {
      return res.status(200).json(
          Failure('토큰이 일치하지 않습니다.'),
      );
    }

    const getUser = await userService.getUserById(verifyingJWT.user.id);

    if (getUser === null) {
      return res.status(400).json(
          Failure(
              '유저를 찾을 수 없습니다.',
          ),
      );
    }

    req.user = getUser;

    next();
  } catch (error) {
    return res.status(400).json(
        Failure(
            '토큰이 만료되었습니다.',
        ),
    );
  }
};

export const checkJWTRefreshToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(200).json(
        Failure('토큰이 일치하지 않습니다.'),
    );
  }

  let verifyingJWT = null;

  try {
    const parseToken = token.split('Bearer ')[1];
    verifyingJWT = await jwt.verify(parseToken, process.env.SECRET_KEY);

    if (typeof verifyingJWT === 'object' &&
        !('snsId' in verifyingJWT) &&
        !('snsType' in verifyingJWT)) {
      return res.status(200).json(
          Failure('토큰이 일치하지 않습니다.'),
      );
    }

    if (!verifyingJWT.snsId || !verifyingJWT.snsType) {
      return res.status(200).json(
          Failure('토큰이 일치하지 않습니다.'),
      );
    }
  } catch (error) {
    return res.status(400).json(
        Failure(
            '토큰이 만료되었습니다.',
        ),
    );
  }

  try {
    const getUser = await userService.getUserBySnsAuth(
        verifyingJWT.snsId,
        verifyingJWT.snsType,
    );
    req.user = getUser;

    next();
  } catch (error) {
    return res.status(400).json(
        Failure(
            '유저를 찾을 수 없습니다.',
        ),
    );
  }
};


export default {
  checkSNSAccessToken,
  checkJWTAccessToken,
  checkJWTRefreshToken,
};
