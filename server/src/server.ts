import express from 'express';
import path from 'path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001/graphql", "http://localhost:3000/register", "http://localhost:3000/"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }));

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001/graphql", "http://localhost:3000/register", "http://localhost:3000/", "/register", "/", "http://localhost:3000/login", "/login", "/graphql"],
      methods: ["GET", "POST", "PUT", "DELETE"]
    }));

  if (process.env.NODE_ENV === 'production') {
    app.use(
      express.static(
        path.join(__dirname, '../../client/dist')
      )
    );

    app.get('/', (_req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, '../../client/dist')
      );
    });
  }
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  };

  startApolloServer();
