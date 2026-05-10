import express from 'express';
import { getBudget, updateBudget, addExpense, deleteExpense } from '../controllers/budget.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true }); 

router.use(protect);

router.route('/')
  .get(getBudget)
  .put(updateBudget);

router.route('/expenses')
  .post(addExpense);

router.route('/expenses/:expenseId')
  .delete(deleteExpense);

export default router;
