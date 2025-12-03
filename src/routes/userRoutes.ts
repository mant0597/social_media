import express from 'express';
import { followUser, unfollowUser, blockUser, unblockUser, acceptFollow, rejectFollow, getProfile, getNotifications, searchUsers } from '../controllers/userController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/search', auth, searchUsers);
router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);
router.post('/:id/block', auth, blockUser);
router.post('/:id/unblock', auth, unblockUser);
router.post('/:id/accept', auth, acceptFollow);
router.post('/:id/reject', auth, rejectFollow);
router.get('/notifications', auth, getNotifications);
router.get('/:id', auth, getProfile);

export default router;
