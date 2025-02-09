import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import './config/connection.js'; // Ensures DB connects before server starts
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
const contextFunction = async ({ req }: { req: Request }) => {
  if (!req) {
    console.log('❌ No request object received.');
    return { user: null };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ No valid Authorization header received.');
    return { user: null };
  }

  const token = authHeader.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ JWT_SECRET_KEY is missing in environment variables.');
      return { user: null };
    }

    console.log('🔑 Verifying token:', token);
    const decoded = jwt.verify(token, secretKey) as { data: JwtPayload };
    console.log('✅ Token verified successfully:', decoded);

    return { user: decoded.data };
  } catch (err) {
    console.error('❌ Token verification failed:', (err as Error).message);
    return { user: null };
  }
};

const startApolloServer = async () => {
  try {
    await server.start();

    const PORT = process.env.PORT || 3001;
    const app = express();

    // ✅ **CORS Configuration**
    const corsOptions = {
      origin: [
        'http://localhost:3000',
        'https://after-action-review2.onrender.com',
      ],
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

    // ✅ **Serve Client in Production**
    if (process.env.NODE_ENV === 'production') {
      const clientPath = path.join(__dirname, '../../client/dist');
      app.use(express.static(clientPath));

      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(clientPath, 'index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`✅ API server running on port ${PORT}!`);
      console.log(`🚀 Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1); // Exit with failure
  }
};

startApolloServer();