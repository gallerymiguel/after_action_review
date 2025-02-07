import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGODB_URI= process.env.MONGODB_URI || '';

const db= async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected! Yay!');
        return mongoose.connection;
    }
    catch (error) {
        console.error('There was an issue connecting to database:', error);
        throw new Error('Database connection failed.');
    }

};

export default db;