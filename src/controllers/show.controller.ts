import { Request, Response } from 'express';
import { handleError } from '../utils/error';
import { HttpError } from '../types/error';
import { BandShow, Show } from '@prisma/client';
import { getLoggedInUserOrThrow } from '../utils/auth';
import * as showService from '../db/services/show.dbService';

export async function createShow(req: Request, res: Response) {
  try {
    const loggedInUser = await getLoggedInUserOrThrow(req);
    const show = req.body as Partial<Pick<Show, 'date' | 'eventName' | 'doorsOpenAt'>> & {
      bandsPlaying?: Pick<BandShow, 'bandId'>[]
    };
    if (!show.bandsPlaying?.length) {
      throw new HttpError(400, 'bandsPlaying is required');
    } else if (!show.date) {
      throw new HttpError(400, 'date is required');
    }

    const createdShow = await showService.createShow({
      date: show.date,
      bandsPlaying: show.bandsPlaying.map(({ bandId }, idx) => ({ bandId, lineupOrder: idx })),
      createdById: loggedInUser.id,
      ...(show.eventName && {
        eventName: show.eventName
      }),
      ...(show.doorsOpenAt && {
        doorsOpenAt: show.doorsOpenAt
      })
    });

    return res.send(createdShow);
  } catch (error) {
    return handleError(error as HttpError, res);
  }
}