import { Router } from 'express';
import { createCity, listStates, searchCities } from '../controllers/location.controller';

const router = Router();

router.get('/states', listStates);
router.post('/city/search', searchCities);
router.post('/city', createCity);

export default router;
