import express from 'express';
import { createPost, deletePost, likePost, unlikePost } from '../controllers/postController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);

export default router;
