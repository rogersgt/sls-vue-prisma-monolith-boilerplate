import { Request, Response } from 'express';
import { getLoggedInUserOrThrow } from '../utils/auth';
import { HttpError } from '../types/error';
import { handleError } from '../utils/error';
import * as userService from '../db/services/user.dbService';

export async function getUser(req: Request, res: Response) {
  const { id: requestedUserId } = req.params;

  try {
    const loggedInUser = await getLoggedInUserOrThrow(req);

    if (requestedUserId && requestedUserId !== loggedInUser.id) {
      // TODO: check permissions for users
    }

    const responseUser = requestedUserId ? await userService.getUser(requestedUserId) : loggedInUser;

    return res.send(responseUser);
  } catch (error: unknown) {
    return handleError(error as HttpError, res);
  }
}