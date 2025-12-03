import express from 'express';
import { getFeed } from '../controllers/feedController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', auth, getFeed);

export default router;
