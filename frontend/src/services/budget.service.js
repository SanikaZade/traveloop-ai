import api from './api';

export const getBudget = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/budget`);
  return response.data;
};

export const updateBudget = async (tripId, data) => {
  const response = await api.put(`/trips/${tripId}/budget`, data);
  return response.data;
};

export const addExpense = async (tripId, expense) => {
  const response = await api.post(`/trips/${tripId}/budget/expenses`, expense);
  return response.data;
};

export const deleteExpense = async (tripId, expenseId) => {
  const response = await api.delete(`/trips/${tripId}/budget/expenses/${expenseId}`);
  return response.data;
};
