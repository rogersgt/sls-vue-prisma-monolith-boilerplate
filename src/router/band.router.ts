import { Router } from 'express';
import { createBand, deleteBand, listBandsByCity, listBandsForUser, searchBands } from '../controllers/band.controller';

const router = Router();

router.post('/', createBand);
router.get('/', listBandsForUser);
router.post('/search', searchBands);
router.get('/discover/:cityId', listBandsByCity);
router.delete('/:bandId', deleteBand);

export default router;
