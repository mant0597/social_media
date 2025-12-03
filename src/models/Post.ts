import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);
