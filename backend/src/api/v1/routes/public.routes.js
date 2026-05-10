import express from 'express';
import { getPublicTrip, copyPublicTrip } from '../controllers/public.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to view the trip
router.get('/trips/:tripId', getPublicTrip);

// Protected route to copy a public trip to own account
router.post('/trips/:tripId/copy', protect, copyPublicTrip);

export default router;
