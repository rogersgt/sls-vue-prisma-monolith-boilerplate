import { Router } from 'express';
import { createBand, listBandsByCity, searchBands } from '../controllers/band.controller';

const router = Router();

router.post('/', createBand);
router.post('/search', searchBands);
router.get('/discover/:cityId', listBandsByCity);

export default router;
