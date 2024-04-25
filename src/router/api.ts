import { Router } from 'express';

const api = Router();

api.get('/status', (_req, res) => res.status(200).json({ status: 'ok' }));

export default api;
