import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string;
    role: 'user' | 'admin' | 'owner';
    following: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    followRequests: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
