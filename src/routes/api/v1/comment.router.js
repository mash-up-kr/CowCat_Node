/* eslint-disable max-len */
import express from 'express';
import commentController from '../../../controllers/counselingComment.controller.js';

const router = new express.Router();

router.route('/').get(commentController.getCommentsByUserId);

export default router;
