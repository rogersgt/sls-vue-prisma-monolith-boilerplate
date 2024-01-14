import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import logger from '../logger';
import jwt from 'jsonwebtoken';
import config from '../config';
import { COOKIE_ACCESS_TOKEN_NAME, WHITELISTE_ROUTES } from '../constants';

let authClient: OAuth2Client | undefined;

export async function getAuthClient(appClientSecret: string) {
  if (!authClient) {
    authClient = new OAuth2Client({
      clientId: process.env.GOOGLE_APP_CLIENT_ID,
      clientSecret: appClientSecret,
      redirectUri: process.env.ALLOW_CORS_ORIGIN
    });
  }
  return authClient;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.debug({ baseUrl: req.url })
  if (WHITELISTE_ROUTES.includes(req.url)) return next();
  try {
    const jwtToken = req.cookies[COOKIE_ACCESS_TOKEN_NAME];
    if (!jwtToken) {
      return res.status(401).send()
    }

    const JWT_SECRET = await config.get('JWT_SECRET');
    if (!JWT_SECRET) {
      throw new Error('server misconfiguration');
    }

    const decoded = await jwt.verify(jwtToken, JWT_SECRET) as jwt.JwtPayload & { email: string };

    req.headers['app.user.email'] = decoded.email;

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).send();
  }
}