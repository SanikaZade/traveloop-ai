import express from 'express';
import { searchCities, getActivitiesForCity } from '../controllers/city.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // Ensure search is only for authenticated users

router.get('/search', searchCities);
router.get('/:cityId/activities', getActivitiesForCity);

export default router;
