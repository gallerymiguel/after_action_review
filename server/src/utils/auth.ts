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
  if (!req || !req.headers) {
    console.error("❌ Request object is missing or malformed.");
    return { user: null };
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("⚠️ No Authorization header received.");
    return { user: null };
  }

  // ✅ Ensure correct "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    console.warn("⚠️ No token found in Authorization header.");
    return { user: null };
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      console.error("❌ JWT_SECRET_KEY is missing in environment variables.");
      console.log("🔍 Attempted JWT Secret Key:", secretKey);
      return { user: null };
    }

    console.log("🔍 Using JWT Secret Key:", secretKey); // ✅ Logs the key for debugging

    const decoded = jwt.verify(token, secretKey) as { data: JwtPayload };

    if (!decoded || !decoded.data) {
      console.warn("⚠️ Token does not contain valid user data.");
      return { user: null };
    }

    console.log('✅ Token verified successfully:', decoded.data);
    return { user: decoded.data };
  } catch (err) {
    console.error('❌ Token verification failed:', (err as Error).message);
    return { user: null };
  }
};

// ✅ Function to sign JWT token
export const signToken = (username: string, email: string, _id: string, role: string): string => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("❌ JWT_SECRET_KEY is missing in environment variables.");
  }

  console.log("🔍 Signing token with JWT Secret Key:", secretKey); // ✅ Debugging line

  return jwt.sign(
    { data: { username, email, _id, role } }, // ✅ Ensure proper payload format
    secretKey,
    { expiresIn: '2h' }
  );
};

// ✅ Ensure AuthenticationError is properly exported
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};