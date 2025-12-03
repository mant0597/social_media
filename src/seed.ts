import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/social-feed');
        console.log('MongoDB Connected');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const users = [
            {
                username: 'owner',
                password: hashedPassword,
                role: 'owner',
            },
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
            },
            {
                username: 'user1',
                password: hashedPassword,
                role: 'user',
            }
        ];

        for (const user of users) {
            const existingUser = await User.findOne({ username: user.username });
            if (!existingUser) {
                await User.create(user);
                console.log(`Created user: ${user.username}`);
            } else {
                console.log(`User already exists: ${user.username}`);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
