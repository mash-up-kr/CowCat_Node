import express from 'express';
import userRouter from './user.router.js';
import counselingRouter from './counseling.router.js';

const router = new express.Router();

router.use('/users', userRouter);
router.use('/counseling', counselingRouter);

export default router;
