import { Router } from 'express';

import authRouter from './auth.router';
import userRouter from './user.router';
import bandRouter from './band.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/band', bandRouter);

export default router;
