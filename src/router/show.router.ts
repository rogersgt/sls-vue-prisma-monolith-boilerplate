import { Router } from 'express';
import { createShow } from '../controllers/show.controller';

const router = Router();

router.post('/', createShow);

export default router;
