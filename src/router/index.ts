import { Router } from 'express';

import authRouter from './auth.router';
import userRouter from './user.router';

const router = Router();

router.get('/status', (_req, res) => res.status(200).send({ status: 'all good!' }));
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
