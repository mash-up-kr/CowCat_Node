import jwt from 'jsonwebtoken';

export const isRequired = (snsType) => {
  return !snsType;
};

export const createToken = async (userId, snsId, snsType) => {
  const accessToken = await jwt.sign(
      {
        user: {
          userId,
        },
      },
      process.env.SECRET_KEY,
      {expiresIn: 7 * 24 * 60 * 60},
  );
  const refreshToken = await jwt.sign(
      {
        snsId,
        snsType,
      },
      process.env.SECRET_KEY,
      {expiresIn: 30 * 24 * 60 * 60},
  );
  return {accessToken, refreshToken};
};

export default {
  createToken,
};
