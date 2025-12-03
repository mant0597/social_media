import Activity from '../models/Activity';
import mongoose from 'mongoose';

export const logActivity = async (
    type: 'post_created' | 'user_followed' | 'post_liked',
    actor: string | mongoose.Types.ObjectId,
    target?: string | mongoose.Types.ObjectId,
    relatedPost?: string | mongoose.Types.ObjectId
) => {
    try {
        const activity = new Activity({
            type,
            actor,
            target,
            relatedPost
        });
        await activity.save();
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
