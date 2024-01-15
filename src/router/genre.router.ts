import { Router } from 'express';
import { listGenres } from '../controllers/genre.controller';

const router = Router();

router.get('/', listGenres);

export default router;
