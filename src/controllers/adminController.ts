import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import Activity from '../models/Activity';

interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'owner') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'owner') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToDelete.role === 'owner' && userRole !== 'owner') {
            return res.status(403).json({ message: 'Admins cannot delete Owners' });
        }

        await Post.deleteMany({ author: id });
        await Activity.deleteMany({ actor: id });

        await User.updateMany({}, {
            $pull: {
                following: id,
                followers: id,
                blockedUsers: id
            }
        });

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const currentUserRole = req.userRole;

    if (currentUserRole !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Only Owners can manage roles.' });
    }

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Can only set to user or admin.' });
    }

    try {
        const userToUpdate = await User.findById(id);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        res.status(200).json({ message: `User role updated to ${role}` });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
