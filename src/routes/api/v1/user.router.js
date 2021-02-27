import express from 'express';
import userController from '../../../controllers/user.controller.js';

const router = new express.Router();

router.use('/signup', userController.postSignUp);
router.use('/signin', userController.postSignIn);
router.use('/refresh', userController.postRefreshToken);
router.use('/nickname/check', userController.postCheckNickname);

router.route('/me')
    .get(userController.getMyProfile)
    .put(userController.putMyProfile);

export default router;
