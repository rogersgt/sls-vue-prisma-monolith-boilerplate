
import helmet from 'helmet';
import serverless from 'serverless-http';
import cors from 'cors';
import express, { Request, Response } from 'express';
import cookies from 'cookie-parser';
import router from './router';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
  {
    origin: process.env.ALLOW_CORS_ORIGIN || '*',
    credentials: true,
  }
));
app.use(cookies());
app.use(authMiddleware);
app.use(router);

app.use('*', (_req: Request, res: Response) => res.status(404).send('Endpoint not found'));

export const api = serverless(app);
