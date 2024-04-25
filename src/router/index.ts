import { Router, static as expressStatic } from 'express';
import api from './api';
import helmet from 'helmet';

const router = Router();

// frontend views
// router.get('/index.js', expressStatic('src/client/dist/index.js', {
//   setHeaders: (res) => {
//     res.set('Content-Type', 'application/javascript');
//   }
// }));
router.use('/',
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://unpkg.com'],
      styleSrc: ["'self'"],
    }
  }),
  expressStatic('src/client/dist')
);


// backend routes
router.use('/api', helmet(), api);

export default router;
