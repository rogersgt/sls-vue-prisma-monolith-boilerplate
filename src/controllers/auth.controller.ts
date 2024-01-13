import { Request, Response } from 'express';
import logger from '../logger';
import { getAuthClient } from '../middleware/auth';

export async function login(req: Request, res: Response) {
  const { code } = (req.body ?? {}) as { code?: string };
  if (!code) {
    return res.status(400).send();
  }

  try {
    const googleAuthClient = await getAuthClient();
    const { tokens } = await googleAuthClient.getToken(code);
    logger.debug({
      tokens,
    });
    return res.send({
      tokens
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
}