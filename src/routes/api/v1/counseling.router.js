/* eslint-disable max-len */
import express from 'express';
import commentController from '../../../controllers/counselingComment.controller.js';
import questionController from '../../../controllers/counselingQuestion.controller.js';

const router = new express.Router();

router
    .route('/')
    .get(questionController.getQuestions)
    .post(questionController.postQuestion);

router.route('/my').get(questionController.getMyQuestions);

router
    .route('/:questionId(\\d+)')
    .get(questionController.getQuestion)
    .put(questionController.putQuestion)
    .delete(questionController.deleteQuestion);

router
    .route('/:questionId(\\d+)/comments')
    .get(commentController.getComments)
    .post(commentController.postComment);

router
    .route('/:questionId(\\d+)/comments/:commentId(\\d+)')
    .put(commentController.putComment)
    .delete(commentController.deleteComment);

router
    .route('/:questionId(\\d+)/like')
    .post(questionController.postQuestionLike)
    .delete(questionController.deleteQuestionLike);

export default router;
