import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { logActivity } from '../services/activityService';

interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const createPost = async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const currentUserId = req.userId;

    try {
        const newPost = new Post({
            content,
            author: currentUserId
        });

        await newPost.save();

        await logActivity('post_created', currentUserId!, undefined, newPost._id);

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;
    const userRole = req.userRole;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== currentUserId && userRole !== 'admin' && userRole !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const likePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.likes.includes(currentUserId as any)) {
            await post.updateOne({ $push: { likes: currentUserId } });

            await logActivity('post_liked', currentUserId!, undefined, post._id);

            res.status(200).json({ message: 'Post liked' });
        } else {
            res.status(400).json({ message: 'You already liked this post' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.userId;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(currentUserId as any)) {
            await post.updateOne({ $pull: { likes: currentUserId } });
            res.status(200).json({ message: 'Post unliked' });
        } else {
            res.status(400).json({ message: 'You have not liked this post' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
