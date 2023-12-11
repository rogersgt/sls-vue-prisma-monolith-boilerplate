import { Request, Response } from 'express';
import favicon from '../assets/favicon.ico';

export function renderFavicon(_req: Request, res: Response) {
  return res
    .header('Content-Type', 'application/octet-stream')
    // .header('Content-Disposition, ')
    .send(favicon);
}