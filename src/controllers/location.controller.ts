import { Request, Response } from 'express';
import { handleError } from '../utils/error';
import * as locationService from '../db/services/location.dbService';
import { HttpError } from '../types/error';
import { getDbPaginationFormQueryParams } from '../utils/api';

export async function listStates(req: Request, res: Response) {
  try {
    const countryIdQueryParam = req.query['countryId'];
    const countryId = countryIdQueryParam ? countryIdQueryParam as string : undefined;
    const states = await locationService.listStates(countryId);

    return res.send(states);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function searchCities(req: Request, res: Response) {
  try {
    const { skip, take } = getDbPaginationFormQueryParams(req);
    const { nameQuery, provinceId } = req.body as Partial<{
      nameQuery: string;
      provinceId: string;
    }>;

    if (!nameQuery) {
      throw new HttpError(400, 'nameQuery is required for search cities')
    }

    const cities = await locationService.searchCities({
      nameQuery,
      provinceId
    }, {
      skip,
      take
    });
    return res.send(cities);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}

export async function createCity(req: Request, res: Response) {
  try {
    const {
      name,
      abbreviation,
      provinceId
    } = req.body as { name: string; abbreviation: string; provinceId: string };

    if (!name || !abbreviation || !provinceId) {
      throw new HttpError(400, 'name, abbreviation, and provinceId are all required');
    }

    const city = await locationService.createCity({
      name,
      abbreviation,
      provinceId
    });
    return res.send(city);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}