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

// ✅ Function to authenticate the token from the request
export const authenticateToken = (req: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    console.log('❌ No token provided');
    return { user: null }; // ✅ Ensure we always return an object
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ JWT_SECRET_KEY is missing in environment variables.');
      return { user: null };
    }

    const decoded = jwt.verify(token, secretKey) as { data: JwtPayload };
    console.log('✅ Decoded Token:', decoded.data);
    return { user: decoded.data };
  } catch (err) {
    console.error('❌ Invalid token:', (err as Error).message);
    return { user: null };
  }
};

// ✅ Function to sign JWT token
export const signToken = (username: string, email: string, _id: string, role: string): string => {
  const payload = { username, email, _id, role };
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    console.error("❌ JWT_SECRET_KEY is missing in environment variables.");
    throw new Error("JWT Secret key is required.");
  }

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};


// ✅ Ensure AuthenticationError is properly exported
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}