import { Router } from 'express';

import authRouter from './auth.router';
import userRouter from './user.router';
import bandRouter from './band.router';
import locationRouter from './location.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/band', bandRouter);
router.use('/location', locationRouter);

export default router;
