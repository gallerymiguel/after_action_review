import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ No MongoDB connection string found. Ensure MONGODB_URI is set.');
    process.exit(1);
}

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI); // No extra options needed in Mongoose 7+

        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Immediately connect
connectDB();

export default mongoose.connection;