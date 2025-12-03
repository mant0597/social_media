import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { logActivity } from '../services/activityService';

interface AuthRequest extends Request {
    userId?: string;
}

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const query = req.query.query as string;
    const currentUserId = req.userId;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const users = await User.find({
            username: { $regex: query, $options: 'i' },
            _id: { $ne: currentUserId }
        }).select('username _id');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const followUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    if (currentUserId === id) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.following.includes(userToFollow._id as any)) {
            return res.status(400).json({ message: 'You already follow this user' });
        }

        if (userToFollow.followRequests.includes(currentUser._id as any)) {
            return res.status(400).json({ message: 'Follow request already sent' });
        }

        await userToFollow.updateOne({ $push: { followRequests: currentUser._id } });

        res.status(200).json({ message: 'Follow request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const acceptFollow = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const currentUser = await User.findById(currentUserId);
        const requester = await User.findById(id);

        if (!currentUser || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!currentUser.followRequests.includes(requester._id as any)) {
            return res.status(400).json({ message: 'No follow request from this user' });
        }

        await currentUser.updateOne({
            $push: { followers: requester._id },
            $pull: { followRequests: requester._id }
        });
        await requester.updateOne({ $push: { following: currentUser._id } });

        await logActivity('user_followed', requester._id, currentUser._id);

        res.status(200).json({ message: 'Follow request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const rejectFollow = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await currentUser.updateOne({ $pull: { followRequests: id } });

        res.status(200).json({ message: 'Follow request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const userToUnfollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.following.includes(userToUnfollow._id as any)) {
            await currentUser.updateOne({ $pull: { following: userToUnfollow._id } });
            await userToUnfollow.updateOne({ $pull: { followers: currentUser._id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const blockUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const userToBlock = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToBlock || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!currentUser.blockedUsers.includes(userToBlock._id as any)) {
            await currentUser.updateOne({ $push: { blockedUsers: userToBlock._id } });

            await currentUser.updateOne({ $pull: { following: userToBlock._id } });
            await userToBlock.updateOne({ $pull: { followers: currentUser._id } });

            res.status(200).json({ message: 'User blocked' });
        } else {
            res.status(400).json({ message: 'You already blocked this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const unblockUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const userToUnblock = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnblock || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.blockedUsers.includes(userToUnblock._id as any)) {
            await currentUser.updateOne({ $pull: { blockedUsers: userToUnblock._id } });
            res.status(200).json({ message: 'User unblocked' });
        } else {
            res.status(400).json({ message: 'You have not blocked this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const user = await User.findById(id).select('-password');
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ author: id }).sort({ createdAt: -1 });
        const postsCount = posts.length;
        const followersCount = user.followers.length;
        const followingCount = user.following.length;

        const isFollowing = user.followers.includes(currentUserId as any);
        const isRequested = user.followRequests.includes(currentUserId as any);
        const isBlocked = currentUser.blockedUsers.includes(user._id as any);

        res.status(200).json({
            user,
            posts,
            stats: { postsCount, followersCount, followingCount },
            relationship: { isFollowing, isRequested, isBlocked }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
    const currentUserId = req.userId;

    try {
        const currentUser = await User.findById(currentUserId).populate('followRequests', 'username');
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(currentUser.followRequests);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
