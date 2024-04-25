import { Router } from 'express';

const api = Router();

api.get('/status', (_req, res) => res.send({ status: 'ok' }));

export default api;
