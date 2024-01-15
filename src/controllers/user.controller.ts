import { Request, Response } from 'express';
import { getLoggedInUserOrThrow } from '../utils/auth';
import { HttpError } from '../types/error';
import { handleError } from '../utils/error';
import * as userService from '../db/services/user.dbService';

export async function getUser(req: Request, res: Response) {
  const { id: requestedUserId } = req.params;

  try {
    const loggedInUser = await getLoggedInUserOrThrow(req);

    const requestIsForSelf = !requestedUserId || requestedUserId === loggedInUser.id;
    if (!requestIsForSelf) {
      // TODO: check permissions for users
    }

    const responseUser = await userService.getUser(requestIsForSelf ? loggedInUser.id : requestedUserId, {
      bandMemberships: true
    });

    return res.send(responseUser);
  } catch (error: unknown) {
    return handleError(error as HttpError, res);
  }
}