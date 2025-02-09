import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Define User Payload Interface
interface UserPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

// ✅ Define AuthenticatedRequest as a `Request` with a `user` field
export interface AuthenticatedRequest extends Request {
  user: UserPayload; // 👈 `user` must exist after authentication
}

// ✅ Middleware to Authenticate JWT Tokens
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(' ').pop()?.trim();

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as { data: UserPayload };

    // ✅ Type Assertion to ensure `req` is treated as `AuthenticatedRequest`
    (req as AuthenticatedRequest).user = decoded.data;

    return next(); // ✅ Proceed to next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ Function to Generate JWT Token
export const signToken = (username: string, email: string, _id: string, role: string): string => {
  const payload = { username, email, _id, role };
  return jwt.sign({ data: payload }, process.env.JWT_SECRET_KEY || '', { expiresIn: '2h' });
};