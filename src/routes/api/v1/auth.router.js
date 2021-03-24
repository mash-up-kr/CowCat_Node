import express from 'express';
import authController
  from '../../../controllers/auth.controller.js';
import {checkSNSAccessToken} from '../../../middlewares/checkToken.js';

const router = new express.Router();

router.use('/kakao/callback', authController.getKakaoCallback);
router.use('/login', checkSNSAccessToken, authController.postLogin);

export default router;
