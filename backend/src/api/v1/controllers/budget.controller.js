import db from '../../../utils/jsonDb.js';

export const getBudget = async (req, res) => {
  const { tripId } = req.params;
  let budget = await db.findOne('budgets', { tripId });

  if (!budget) {
    budget = await db.create('budgets', { tripId, totalBudget: 0, expenses: [] });
  }

  res.status(200).json({ success: true, data: budget });
};

export const updateBudget = async (req, res) => {
  const { tripId } = req.params;
  const { totalBudget } = req.body;

  let budget = await db.findOne('budgets', { tripId });

  if (!budget) {
    budget = await db.create('budgets', { tripId, totalBudget, expenses: [] });
  } else {
    budget = await db.findByIdAndUpdate('budgets', tripId, { totalBudget });
  }

  res.status(200).json({ success: true, data: budget });
};

export const addExpense = async (req, res) => {
  const { tripId } = req.params;
  let budget = await db.findOne('budgets', { tripId });

  if (!budget) budget = await db.create('budgets', { tripId, totalBudget: 0, expenses: [] });

  const expense = { ...req.body, _id: Math.random().toString(36).substr(2, 9) };
  budget.expenses.push(expense);
  
  await db.findByIdAndUpdate('budgets', tripId, { expenses: budget.expenses });
  res.status(200).json({ success: true, data: budget });
};

export const deleteExpense = async (req, res) => {
  const { tripId, expenseId } = req.params;
  let budget = await db.findOne('budgets', { tripId });
  
  if (budget) {
    budget.expenses = budget.expenses.filter(e => e._id !== expenseId);
    await db.findByIdAndUpdate('budgets', tripId, { expenses: budget.expenses });
  }
  
  res.status(200).json({ success: true, data: budget });
};
