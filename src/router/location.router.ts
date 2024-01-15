import { Router } from 'express';
import { createCity, listStates, searchCities } from '../controllers/location.controller';

const router = Router();

router.get('/states', listStates);
router.post('/cities/search', searchCities);
router.post('/cities', createCity);

export default router;
