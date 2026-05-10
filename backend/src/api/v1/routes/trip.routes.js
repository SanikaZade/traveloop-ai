import express from 'express';
import { getTrips, getTrip, createTrip, updateTrip, deleteTrip } from '../controllers/trip.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import itineraryRoutes from './itinerary.routes.js';
import budgetRoutes from './budget.routes.js';
import packingRoutes from './packing.routes.js';
import noteRoutes from './note.routes.js';

const router = express.Router();

router.use(protect);

// Mount nested routes
router.use('/:tripId/itinerary', itineraryRoutes);
router.use('/:tripId/budget', budgetRoutes);
router.use('/:tripId/packing', packingRoutes);
router.use('/:tripId/notes', noteRoutes);

router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

export default router;
