import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const connectDB = async (): Promise<void> => {
    try {
        if (!MONGODB_URI) {
            throw new Error('❌ No MongoDB connection string provided.');
        }

        await mongoose.connect(MONGODB_URI);

        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Exit the process on failure
    }
};

// Call the function to ensure connection is established
connectDB();

export default mongoose.connection;