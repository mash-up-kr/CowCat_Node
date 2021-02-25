import express from 'express';
import apiV1Router from './api/v1/index.js';

const router = new express.Router();

router.use('/api/v1', apiV1Router);

// Health check
router.get('/', (req, res) => {
  res.send('OK');
});

export default router;
