import { Router } from 'express';
import {
  createBand,
  deleteBand,
  getBand,
  listBandsByCity,
  listBandsForUser,
  searchBands,
  updateBand
} from '../controllers/band.controller';

const router = Router();

router.post('/', createBand);
router.get('/', listBandsForUser);
router.post('/search', searchBands);
router.get('/discover/:cityId', listBandsByCity);
router.delete('/:bandId', deleteBand);
router.get('/:bandId', getBand);
router.put('/:bandId', updateBand);

export default router;
