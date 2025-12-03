import { Request, Response } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';

interface AuthRequest extends Request {
    userId?: string;
}

export const getFeed = async (req: AuthRequest, res: Response) => {
    const currentUserId = req.userId;
    const { type } = req.query; // 'global' or 'following' (default)

    try {
        let activities;

        if (type === 'global') {
            // Fetch all activities for the "Activity Wall"
            activities = await Activity.find()
                .populate('actor', 'username')
                .populate('target', 'username')
                .populate('relatedPost', 'content')
                .sort({ createdAt: -1 })
                .limit(50);
        } else {
            // Default: Fetch activities from followed users (Instagram style)
            const currentUser = await User.findById(currentUserId);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const followingIds = currentUser.following;

            // Filter out blocked users
            const blockedIds = currentUser.blockedUsers;

            activities = await Activity.find({
                actor: { $in: [...followingIds, currentUserId] as any, $nin: blockedIds },
                // Also exclude activities where the actor is someone who blocked the current user? 
                // For simplicity, just filtering blockedUsers.
            })
                .populate('actor', 'username')
                .populate('target', 'username')
                .populate('relatedPost', 'content')
                .sort({ createdAt: -1 })
                .limit(50);
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
