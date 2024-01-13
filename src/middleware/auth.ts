import { NextFunction, Request, Response } from 'express';
// import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import logger from '../logger';
// import jwt from 'jsonwebtoken';
import config from '../config';
import { WHITELISTE_ROUTES } from '../constants';

let authClient: OAuth2Client | undefined;

export async function getAuthClient() {
  if (!authClient) {
    const secret = await config.get('GOOGLE_APP_CLIENT_SECRET');
    authClient = new OAuth2Client({
      clientId: process.env.GOOGLE_APP_CLIENT_ID,
      clientSecret: secret,
      // FIXME: config
      redirectUri: 'http://localhost:3030'
    });
  }
  return authClient;
}


// let certs: Certificates | undefined;

// async function getCerts() {
//   // TODO: check headers for invalidation of pem files (they get rotated)
//   if (!certs) {
//     const { data }: { data: { [hash: string]: string } } = await axios.get('https://www.googleapis.com/oauth2/v1/certs');
//     // certs = Object.keys(data).map((hash) => data[hash]);
//     certs = data;
//   }
//   return certs;
// }

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.debug({ baseUrl: req.url })
  if (WHITELISTE_ROUTES.includes(req.url)) return next();
  try {
    const jwtToken = req.headers.authorization?.replace('Bearer ', '');
    if (!jwtToken) {
      return res.status(401).send()
    }
    
    const googleAuthClient = await getAuthClient();

    const verified = await googleAuthClient.verifyIdToken({
      idToken: jwtToken,
      audience: process.env.GOOGLE_APP_CLIENT_ID
    })
    logger.debug({ verified });

    // req.headers['app.user.email'] = decoded.getPayload()?.email;

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).send();
  }
}