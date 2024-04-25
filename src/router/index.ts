import { Router, static as expressStatic } from 'express';
import api from './api';

const router = Router();

// backend routes
router.use('/api', api);

// frontend views
router.get('/index.js', expressStatic('src/client/dist/index.js', {
  setHeaders: (res) => {
    res.set('Content-Type', 'application/javascript');
  }
}));
router.use('/', expressStatic('src/client/dist'));

export default router;
