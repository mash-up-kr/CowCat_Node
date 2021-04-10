import express from 'express';
import commentController
  from '../../../controllers/counselingComment.controller.js';
import questionController
  from '../../../controllers/counselingQuestion.controller.js';

const router = new express.Router();

router
    .route('/')
    .get(questionController.getQuestions)
    .post(questionController.postQuestion);
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

router.get(
    '/categories',
    questionController.getCategories,
);

router.get(
    '/emotions',
    questionController.getEmotions,
);

export default router;
