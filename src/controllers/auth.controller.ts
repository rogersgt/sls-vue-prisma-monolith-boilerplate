import { Request, Response } from 'express';
import logger from '../logger';
import { getAuthClient } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import config from '../config';
import { upsertUser } from '../db/services/user.dbService';
import { COOKIE_ACCESS_TOKEN_NAME } from '../constants';

export async function login(req: Request, res: Response) {
  logger.debug({
    data: req.body
  })
  const { code } = (req.body ?? {}) as { code?: string };
  if (!code) {
    return res.status(400).send();
  }

  try {
    const { JWT_SECRET, GOOGLE_APP_CLIENT_SECRET } = await config.getMany(['JWT_SECRET', 'GOOGLE_APP_CLIENT_SECRET'])
    const googleAuthClient = await getAuthClient(GOOGLE_APP_CLIENT_SECRET);
    // exchange the google auth code from the signin redirect, and exchange it for a
    // set of google id, access, and refresh tokens
    const { tokens } = await googleAuthClient.getToken(code);
    if (!tokens.id_token) {
      return res.status(401).send();
    }
    const decodedIdToken = jwt.decode(tokens.id_token) as jwt.JwtPayload & {
      email: string;
      email_verified: boolean;
      given_name: string;
      family_name: string;
      picture?: string;
    };

    const user = await upsertUser({
      email: decodedIdToken.email,
      emailVerified: decodedIdToken.email_verified,
      googleUserId: decodedIdToken.sub,
      firstName: decodedIdToken.given_name,
      lastName: decodedIdToken.family_name,
      pictureUrl: decodedIdToken.picture,
    });

    // instead of taking the google access tokens, trust that the code is trusted via the successful exchange
    // and generate our own secure JWT. We may be able to directly use google access tokens for auth here, but not
    // 100% sure if they are only used for google API's; I haven't been successful in trying to verify an access token
    // in this server
    const appJwt = jwt.sign({
      sub: decodedIdToken.sub,
      email: user.email,
    }, JWT_SECRET, {
      expiresIn: '1 day',
    });

    const payload = {
      user,
    };

    return res.cookie(COOKIE_ACCESS_TOKEN_NAME, appJwt, {
      httpOnly: true,
      secure: process.env.ALLOW_CORS_ORIGIN?.startsWith('https://'),
      sameSite: 'lax'
    }).send(payload);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
}