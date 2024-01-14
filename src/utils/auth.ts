import { Request } from 'express';
import { HttpError } from '../types/error';
import { upsertUser } from '../db/services/user.dbService';

export async function getLoggedInUserOrThrow(req: Request) {
  const email = req.headers['app.user.email'];
  if (!email) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    const user = await upsertUser({ email: email as string });
    return user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpError(500, error?.message ?? error?.msg, error?.stack);
  }
}