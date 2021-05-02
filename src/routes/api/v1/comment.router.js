/* eslint-disable max-len */
import express from 'express';
import commentController from '../../../controllers/counselingComment.controller.js';

const router = new express.Router();

router.route('/').get(commentController.getCommentsByUserId);
router
    .route('/:commentId(\\d+)/like')
    .post(commentController.postCommentLike)
    .delete(commentController.deleteCommentLike);

export default router;
