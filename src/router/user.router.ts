import { Router } from 'express';
import { getUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUser);
router.get('/:id', getUser);

export default router;
