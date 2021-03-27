import express from 'express';
import userController from '../../../controllers/user.controller.js';
import {
  checkSNSAccessToken,
  checkJWTAccessToken,
} from '../../../middlewares/checkToken.js';

const router = new express.Router();

router.get(
    '/',
    checkJWTAccessToken,
    userController.getMyProfile,
);

router.patch(
    '/',
    checkJWTAccessToken,
    userController.patchMyProfile,
);

router.post(
    '/',
    checkSNSAccessToken,
    userController.postSignUp,
);

router.use(
    '/nickname/check',
    userController.postCheckNickname,
);

export default router;
