import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MongoDB URI is missing! Check your .env file.");
}

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Database connected successfully!");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error("Database connection failed.");
  }
};

export default db;
