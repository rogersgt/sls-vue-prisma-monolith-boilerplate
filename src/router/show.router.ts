import { Router } from 'express';
import { createShow, searchShows } from '../controllers/show.controller';

const router = Router();

router.post('/', createShow);
router.post('/search', searchShows);

export default router;
