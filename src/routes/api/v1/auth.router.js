import express from 'express';
import authController
  from '../../../controllers/auth.controller.js';
import {
  checkSNSAccessToken,
  checkJWTRefreshToken,
} from '../../../middlewares/checkToken.js';

const router = new express.Router();

router.use('/kakao/callback', authController.getKakaoCallback);

router.use(
    '/login',
    checkSNSAccessToken,
    authController.postLogin,
);

router.use(
    '/refresh',
    checkJWTRefreshToken,
    authController.postRefreshToken,
);

export default router;
