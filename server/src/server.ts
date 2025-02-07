import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ✅ FIX: Context function properly extracts the token
const contextFunction = async ({ req }: { req: Request }) => {
  const user = authenticateToken(req); // Ensure this function returns `{ user }`
  return { user };
};

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  // ✅ Fix CORS issue
  app.use(cors({
    origin: ['http://localhost:3000'], // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  app.options('*', cors()); // Handle preflight requests

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // ✅ Ensure Apollo Server is properly configured with CORS
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
};

startApolloServer();