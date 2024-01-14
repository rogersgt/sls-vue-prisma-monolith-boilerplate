import { Request, Response } from 'express';
import { handleError } from '../utils/error';
import { HttpError } from '../types/error';
import { getDbPaginationFormQueryParams } from '../utils/api';
import * as bandService from '../db/services/band.dbService';
import logger from '../logger';

export async function searchBands(req: Request, res: Response) {
  const { skip, take } = getDbPaginationFormQueryParams(req);
  logger.debug({ skip, take });

  try {
    const { name, cityId } = req.body as Partial<{ cityId: string; name: string }>
    if (!name) {
      throw new HttpError(400, 'name is required in band search');
    }

    const bands = await bandService.searchBands({ name, cityId }, { skip, take });

    return res.send(bands);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function listBandsByCity(req: Request, res: Response) {
  const { skip, take } = getDbPaginationFormQueryParams(req);

  try {
    const { cityId } = req.params;
    if (!cityId) {
      throw new HttpError(400, 'cityId is a required parameter');
    }

    const bands = await bandService.listBandsByCity(cityId, { skip, take });
    return res.send(bands);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}