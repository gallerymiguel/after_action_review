// import jwt from 'jsonwebtoken';
// import { GraphQLError } from 'graphql';
// import dotenv from 'dotenv';
// dotenv.config();


// export const authenticateToken = ({ req }: any) => {

//   let token = req.body.token || req.query.token || req.headers.authorization;

//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   if (!token) {
//     return req;
//   }

//   try {
//     const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
//     req.user = data;
//   } catch (err) {
//     console.log('Invalid token');
//   }

//   return req;
// };

// export const signToken = (username: string, email: string, _id: unknown) => {
//   const payload = { username, email, _id };
//   const secretKey: any = process.env.JWT_SECRET_KEY;

//   return jwt.sign({data: payload}, secretKey, { expiresIn: '2h' });
// };

// export class AuthenticationError extends GraphQLError {
//   constructor(message: string) {
//     super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
//     Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
//   }
// };

import jwt, { JwtPayload } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (token: string): JwtPayload | null => {
  if (!token) return null;

  try {
    // Verify JWT Token
    const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || "", { maxAge: "2h" }) as { data: JwtPayload };
    return data; // Return decoded user data
  } catch (err) {
    console.error("❌ Invalid token:", err);
    throw new AuthenticationError("Invalid or expired token.");
  }
};

// 🔹 Sign a new token (Used when registering or logging in)
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, process.env.JWT_SECRET_KEY!, { expiresIn: "2h" });
};

// 🔹 Custom Authentication Error Class
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ["UNAUTHENTICATED"]);
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
};

export default { authenticateToken, signToken, AuthenticationError };