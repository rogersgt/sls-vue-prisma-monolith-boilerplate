import { Router } from 'express';
import { listBandsByCity, searchBands } from '../controllers/band.controller';

const router = Router();

router.post('/search', searchBands);
router.get('/:cityId', listBandsByCity);

export default router;
