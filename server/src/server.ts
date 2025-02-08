import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { typeDefs, resolvers } from './schemas/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ✅ **Improved Context Function**
const contextFunction = async ({ req }: { req?: Request }) => {
  if (!req) {
    console.error("❌ Request object is missing.");
    return { user: null };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("⚠️ No Authorization header received.");
    return { user: null };
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    console.log("⚠️ No token found in Authorization header.");
    return { user: null };
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "";
    if (!secretKey) throw new Error("Missing JWT_SECRET_KEY in environment variables.");

    const decoded = jwt.verify(token, secretKey) as { data: JwtPayload };

    if (!decoded || !decoded.data) {
      console.log("⚠️ Token does not contain valid user data.");
      return { user: null };
    }

    console.log("✅ Token verified successfully:", decoded.data);
    return { user: decoded.data }; // ✅ Ensure `user` is correctly structured
  } catch (err) {
    console.error("❌ Token verification failed:", (err as Error).message);
    return { user: null };
  }
};

const startApolloServer = async () => {
  try {
    await server.start();
    await db();
    console.log("✅ Database connected successfully!");

    const PORT = process.env.PORT || 3001;
    const app = express();

    // ✅ **CORS Configuration**
    const corsOptions = {
      origin: ['http://localhost:3000', 'https://after-action-review.onrender.com/'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };

    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions)); // ✅ Handle preflight requests

    // ✅ **Ensure Express Parses JSON Requests**
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // ✅ **Properly Attach `contextFunction` to Apollo Server**
    app.use('/graphql', expressMiddleware(server, { context: contextFunction }));

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../client/dist')));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`✅ API server running on port ${PORT}!`);
      console.log(`🚀 Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1); // Exit with failure
  }
};

startApolloServer();