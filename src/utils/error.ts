import { Response } from 'express';
import { HttpError } from '../types/error';
import logger from '../logger';

export function handleError(error: Error | HttpError, res: Response) {
  logger.error({
    error
  });
  if (error instanceof HttpError) {
    return res.status(error.code).send(error.message);
  }
  return res.status(500).send('An internal issue occurred');
}