import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

router.get('/status', (_req, res) => res.status(200).send({ status: 'all good!' }))

router.post('/login', login);

export default router;
