import { Request, Response } from 'express';
import { handleError } from '../utils/error';
import { HttpError } from '../types/error';
import { getDbPaginationFormQueryParams } from '../utils/api';
import * as bandService from '../db/services/band.dbService';
import logger from '../logger';
import { Band, Genre } from '@prisma/client';
import { getLoggedInUserOrThrow } from '../utils/auth';

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

export async function createBand(req: Request, res: Response) {
  try {
    const loggedInUser = await getLoggedInUserOrThrow(req);
    const bandInput = req.body as Partial<Band> & { genres: Genre[] };
    if (!bandInput.cityId || !bandInput.name) {
      throw new HttpError(400, 'name and cityId are required for createBand')
    }

    if (!bandInput.genres.every((genre) => !!genre.id)) {
      throw new HttpError(400, 'genre.id is required for creating a band')
    }

    const createdBand = await bandService.createBand({
      cityId: bandInput.cityId ?? '',
      name: bandInput.name ?? '',
      genres: bandInput.genres.map(({ id }) => ({ id }))
    }, loggedInUser.id);

    return res.send(createdBand);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}
