import { Request, Response } from 'express';
import { HttpError } from '../types/error';
import { handleError } from '../utils/error';
import * as genreService from '../db/services/genre.dbService';

export async function listGenres(_req: Request, res: Response) {
  try {
    const genres = await genreService.listGenres();
    return res.send(genres);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}
