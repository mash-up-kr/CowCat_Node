import express from 'express';
import userRouter from './user.router.js';

const router = new express.Router();

router.use('/users', userRouter);

export default router;
