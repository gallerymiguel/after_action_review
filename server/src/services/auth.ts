import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop()?.trim();
  }

  if (!token) {
    console.log("❌ No token provided");
    return { user: null }; // Return explicit null user
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", { maxAge: "2h" });
    console.log("🔓 Decoded Token:", data); // Debugging - See if token is properly decoded
    return { user: data }; // ✅ Return user object
  } catch (err) {
    console.log("❌ Invalid token:", err);
    return { user: null }; // Return explicit null user on failure
  }
};


export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  return jwt.sign({data: payload}, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};