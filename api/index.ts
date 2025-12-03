import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import connectDB from '../src/config/db';

export default async (req: VercelRequest, res: VercelResponse) => {
    await connectDB();
    app(req, res);
};
