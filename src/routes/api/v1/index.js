import express from 'express';
import authRouter from './auth.router.js';
import userRouter from './user.router.js';
import counselingRouter from './counseling.router.js';
import {checkJWTAccessToken} from '../../../middlewares/checkToken.js';

const router = new express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/counselings', checkJWTAccessToken, counselingRouter);

export default router;
