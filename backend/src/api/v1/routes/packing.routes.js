import express from 'express';
import { getPackingList, updatePackingList } from '../controllers/packing.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true }); 

router.use(protect);

router.route('/')
  .get(getPackingList)
  .put(updatePackingList);

export default router;
