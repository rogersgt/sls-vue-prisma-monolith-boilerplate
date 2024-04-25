
import helmet from 'helmet';
import cors from 'cors';
import serverless from 'serverless-http';
import express from 'express';
import cookies from 'cookie-parser';
import router from './router';

const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://unpkg.com'],
    styleSrc: ["'self'"],
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(router);

export const handler = serverless(app);
