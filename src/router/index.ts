import { Router } from 'express';

import authRouter from './auth.router';
import userRouter from './user.router';
import bandRouter from './band.router';
import locationRouter from './location.router';
import genreRouter from './genre.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/band', bandRouter);
router.use('/location', locationRouter);
router.use('/genre', genreRouter);

export default router;
