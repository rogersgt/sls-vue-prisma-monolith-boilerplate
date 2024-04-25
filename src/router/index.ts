import { Router, static as expressStatic } from 'express';
import api from './api';
import helmet from 'helmet';

const router = Router();

// frontend views
router.use('/',
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://unpkg.com'],
      styleSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    }
  }),
  expressStatic('src/client/dist')
);


// backend routes
router.use('/api', helmet(), api);

export default router;
