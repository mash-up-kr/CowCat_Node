import express from 'express';
import commentController from '../../../controllers/counselingComment.controller.js';
import questionController from '../../../controllers/counselingQuestion.controller.js';

const router = new express.Router();

router
  .route('/')
  .get(questionController.getQuestions)
  .post(questionController.postQuestion);
router
  .route('/:questionId')
  .get(questionController.getQuestion)
  .put(questionController.putQuestion)
  .delete(questionController.deleteQuestion);

router
  .route('/:questionId/comments')
  .get(commentController.getComments)
  .post(commentController.postComment);
router
  .route('/:questionId/comments/:commentId')
  .put(commentController.putComment)
  .delete(commentController.deleteComment);

export default router;
