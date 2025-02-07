import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || '';

if (!SECRET_KEY) {
  throw new Error('❌ JWT Secret Key is missing! Please set JWT_SECRET_KEY in .env');
}

/**
 * Generates a signed JWT token for authentication.
 * @param username - The username of the user.
 * @param email - The email of the user.
 * @param _id - The unique ID of the user.
 * @param role - The role of the user (EVALUATOR or USER).
 * @returns The signed JWT token.
 */
export const signToken = (username: string, email: string, _id: string, role: string): string => {
  const payload = { username, email, _id, role };

  return jwt.sign({ data: payload }, SECRET_KEY, { expiresIn: '2h' });
};

/**
 * Middleware function to authenticate user tokens.
 * @param req - The Express request object.
 * @returns { user: JwtPayload | null } - Returns the decoded user or null.
 */
export const authenticateToken = ({ req }: any): { user: JwtPayload | null } => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    console.log('⚠️ No token provided.');
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, SECRET_KEY) as { data: JwtPayload };
    console.log('✅ Token Verified:', data);
    return { user: data };
  } catch (err) {
    console.log('❌ Invalid token:', err instanceof Error ? err.message : err);
    return { user: null };
  }
};

/**
 * Custom GraphQL Authentication Error.
 */
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'UNAUTHENTICATED' } });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};