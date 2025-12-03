import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    type: 'post_created' | 'user_followed' | 'post_liked';
    actor: mongoose.Types.ObjectId;
    target?: mongoose.Types.ObjectId;
    relatedPost?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
    type: { type: String, enum: ['post_created', 'user_followed', 'post_liked'], required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: Schema.Types.ObjectId, ref: 'User' },
    relatedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
