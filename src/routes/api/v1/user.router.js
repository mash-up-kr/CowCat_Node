import express from 'express';
import userController from '../../../controllers/user.controller.js';
import {
  checkSNSAccessToken,
  checkJWTAccessToken,
  checkJWTRefreshToken,
} from '../../../middlewares/checkToken.js';

const router = new express.Router();

router.use(
    '/signup',
    checkSNSAccessToken,
    userController.postSignUp,
);
router.use(
    '/refresh',
    checkJWTRefreshToken,
    userController.postRefreshToken,
);
router.use(
    '/nickname/check',
    checkJWTAccessToken,
    userController.postCheckNickname,
);

router.route('/me')
    .all(checkJWTAccessToken)
    .get(userController.getMyProfile)
    .put(userController.putMyProfile);

export default router;
