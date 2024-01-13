import { Request, Response } from 'express';
import logger from '../logger';

export async function getUser(_req: Request, res: Response) {
  // const { id: requestedUserId } = req.params;
  try {
    // TODO: Get user query

    return res.send({})
  } catch (error) {
    logger.error(error);
    return res.status(500).send('There was an error fetching user')
  }
}