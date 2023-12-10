import { Router } from 'express';

const router = Router();

router.get('/status', (_req, res) => res.status(200).send({ status: 'all good!' }))

export default router;
