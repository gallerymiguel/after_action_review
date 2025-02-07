import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import Report from '../models/Report.js';

// ✅ Ensure Express request type includes `user`
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

// 🔹 Get a single user by ID or username
export const getSingleUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user ? req.user._id : req.params.id;
    const foundUser = await User.findOne({
      $or: [{ _id: userId }, { username: req.params.username }],
    });

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(foundUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// 🔹 Register a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: 'User creation failed' });
    }

    const token = signToken(user.username, user.email, user._id as string);
    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// 🔹 Login a user
export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or username' });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);
    if (!correctPw) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = signToken(user.username, user.email, user._id as string);
    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// 🔹 Create a new report
export const newReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.create(req.body);
    if (!report) {
      return res.status(400).json({ message: 'Report creation failed' });
    }
    return res.json({ report });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// 🔹 Delete a saved report (Fix `req.user` usage)
export const deleteReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated' });
    }

    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedReports: { reportId: req.params.bookId } } },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(userUpdate);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};