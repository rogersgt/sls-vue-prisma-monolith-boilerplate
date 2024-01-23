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

    if (bandInput.genres?.length && !bandInput.genres.every((genre) => !!genre.id)) {
      throw new HttpError(400, 'genre.id is required for creating a band')
    }

    const createdBand = await bandService.createBand({
      cityId: bandInput.cityId ?? '',
      name: bandInput.name ?? '',
      genres: bandInput.genres.map(({ id }) => ({ id })),
      spotifyArtistId: bandInput.spotifyArtistId
    }, loggedInUser.id);

    return res.send(createdBand);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function listBandsForUser(req: Request, res: Response) {
  try {
    const user = await getLoggedInUserOrThrow(req);
    const bands = await bandService.listBandsUserIsMemberOf(user.id);
    return res.send(bands);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function deleteBand(req: Request, res: Response) {
  try {
    const { bandId } = req.params;
    if (!bandId || typeof bandId !== 'string') {
      throw new HttpError(400, 'bandId must be a string');
    }
    const user = await getLoggedInUserOrThrow(req);
    const band = await bandService.getBand(bandId);
    if (!band?.bandMembers.find(({ userId }) => userId === user.id)) {
      // TODO: implement roles and permissions
      throw new HttpError(404, 'not found');
    }
    await bandService.deleteBand(bandId);
    return res.status(204).send();
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function getBand(req: Request, res: Response) {
  try {
    const bandId = req.params.bandId;
    if (!bandId) {
      throw new HttpError(400, 'bandId required');
    }

    // const user = await getLoggedInUserOrThrow(req);
    const band = await bandService.getBandCustomInclude(bandId, {
      bandMembers: {
        include: {
          user: true
        }
      },
      city: {
        include: {
          province: true
        }
      },
      _count: {
        select: {
          /* upcoming shows */
          showsPlaying: {
            where: {
              show: {
                date: {
                  gte: new Date()
                }
              }
            }
          }
        }
      }
    });

    if (!band) {
      throw new HttpError(404, 'Band not found');
    }
    
    return res.send(band);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}