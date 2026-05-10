import express from 'express';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import cityRoutes from './city.routes.js';
import publicRoutes from './public.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TravelLoop API v1',
    endpoints: {
      health: '/api/v1/health',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        me: 'GET /api/v1/auth/me'
      },
      trips: 'GET|POST /api/v1/trips',
      cities: 'GET /api/v1/cities/search',
      public: 'GET /api/v1/public/trips/:tripId'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/cities', cityRoutes);
router.use('/public', publicRoutes);

export default router;
