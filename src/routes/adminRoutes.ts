import express from 'express';
import { deleteUser, updateUserRole, getAllUsers } from '../controllers/adminController';
import { auth, checkRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', auth, checkRole(['admin', 'owner']), getAllUsers);
router.delete('/users/:id', auth, checkRole(['admin', 'owner']), deleteUser);
router.patch('/users/:id/role', auth, checkRole(['owner']), updateUserRole);

export default router;
