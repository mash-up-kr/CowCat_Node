import jwt from 'jsonwebtoken';

export const createAccessToken = async (userId) => {
  const accessToken = await jwt.sign(
      {
        user: {
          id: userId,
        },
      },
      process.env.SECRET_KEY,
      {expiresIn: 7 * 24 * 60 * 60},
  );

  return 'Bearer ' + accessToken;
};

export const createRefreshToken = async (snsId, snsType) => {
  const refreshToken = await jwt.sign(
      {
        snsId,
        snsType,
      },
      process.env.SECRET_KEY,
      {expiresIn: 30 * 24 * 60 * 60},
  );

  return 'Bearer ' + refreshToken;
};

export const createToken = async (userId, snsId, snsType) => {
  const accessToken = await createAccessToken(userId);
  const refreshToken = await createRefreshToken(snsId, snsType);
  return {accessToken, refreshToken};
};

export default {
  createAccessToken,
  createRefreshToken,
  createToken,
};
