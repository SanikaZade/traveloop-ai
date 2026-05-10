import express from 'express';
import { getItinerary, updateItinerary } from '../controllers/itinerary.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true }); 
// mergeParams is useful if we mount this as /trips/:tripId/itinerary

router.use(protect);

router.route('/')
  .get(getItinerary)
  .put(updateItinerary); // Manual save replaces the stops array

export default router;
