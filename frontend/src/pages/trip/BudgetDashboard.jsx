import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getBudget, updateBudget, addExpense, deleteExpense } from '../../services/budget.service';
import { LoadingSkeleton } from '../../components/Transitions';

const COLORS   = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const CATS     = ['Food', 'Transport', 'Accommodation', 'Activities', 'Other'];

const BudgetDashboard = ({ tripId }) => {
  const [budgetData, setBudgetData]   = useState({ totalBudget: 0, expenses: [] });
  const [loading, setLoading]         = useState(true);
  const [newExpense, setNewExpense]   = useState({ category: 'Food', amount: '', description: '' });
  // BUG-02 fix: inline budget editor replaces prompt()
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => { fetchBudget(); }, [tripId]);

  const fetchBudget = async () => {
    try {
      const data = await getBudget(tripId);
      setBudgetData(data.data);
    } catch (e) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    const total = parseFloat(budgetInput);
    if (isNaN(total) || total < 0) { toast.error('Enter a valid budget amount'); return; }
    try {
      const data = await updateBudget(tripId, { totalBudget: total });
      setBudgetData(data.data);
      setEditingBudget(false);
      toast.success('Budget updated!');
    } catch (e) { /* handled */ }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || isNaN(newExpense.amount)) { toast.error('Enter a valid amount'); return; }
    try {
      const data = await addExpense(tripId, { ...newExpense, amount: Number(newExpense.amount), date: new Date() });
      setBudgetData(data.data);
      setNewExpense({ category: 'Food', amount: '', description: '' });
      toast.success('Expense logged!');
    } catch (e) { /* handled */ }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const data = await deleteExpense(tripId, expenseId);
      setBudgetData(data.data);
      toast.success('Expense removed');
    } catch (e) { /* handled */ }
  };

  // BUG-07 fix: use LoadingSkeleton instead of plain div
  if (loading) return <LoadingSkeleton />;

  const totalSpent = budgetData.expenses.reduce((acc, cur) => acc + cur.amount, 0);
  const remaining  = budgetData.totalBudget - totalSpent;
  const pctUsed    = budgetData.totalBudget > 0 ? Math.min((totalSpent / budgetData.totalBudget) * 100, 100) : 0;

  const aggregated = budgetData.expenses.reduce((acc, cur) => {
    const found = acc.find(i => i.name === cur.category);
    if (found) found.value += cur.amount;
    else acc.push({ name: cur.category, value: cur.amount });
    return acc;
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 text-white">
      <h2 className="text-3xl font-bold mb-8">💰 Budget & Expenses</h2>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Budget', value: `$${budgetData.totalBudget.toLocaleString()}`, color: 'border-l-indigo-500' },
          { label: 'Total Spent',  value: `$${totalSpent.toLocaleString()}`,             color: 'border-l-amber-500' },
          { label: 'Remaining',    value: `$${Math.abs(remaining).toLocaleString()}${remaining < 0 ? ' over' : ''}`, color: remaining < 0 ? 'border-l-red-500' : 'border-l-emerald-500' },
        ].map(stat => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} className={`glass-card p-5 rounded-2xl border-l-4 ${stat.color}`}>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.label === 'Remaining' && remaining < 0 ? 'text-red-400' : 'text-white'}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      {budgetData.totalBudget > 0 && (
        <div className="glass-card p-4 rounded-2xl mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Budget used</span>
            <span>{pctUsed.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pctUsed >= 100 ? 'bg-red-500' : pctUsed > 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${pctUsed}%` }}
            />
          </div>
        </div>
      )}

      {/* Inline budget editor */}
      <div className="mb-8">
        {editingBudget ? (
          <div className="flex gap-3 items-center glass-card p-4 rounded-2xl">
            <label className="text-gray-400 text-sm whitespace-nowrap">Total Budget ($)</label>
            <input
              type="number" min="0" autoFocus
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
              className="input-field flex-1"
              onKeyDown={e => e.key === 'Enter' && handleSaveBudget()}
            />
            <button onClick={handleSaveBudget} className="btn-primary px-4 py-2 text-sm">Save</button>
            <button onClick={() => setEditingBudget(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => { setEditingBudget(true); setBudgetInput(budgetData.totalBudget); }}
            className="btn-ghost text-sm"
          >
            ✏️ Edit Total Budget
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-dark p-6 rounded-2xl border border-gray-700 h-[380px]">
            <h3 className="text-xl font-semibold mb-4">Breakdown by Category</h3>
            {aggregated.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={aggregated} cx="50%" cy="45%" innerRadius={75} outerRadius={115} paddingAngle={4} dataKey="value">
                    {aggregated.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`$${val}`, '']}
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No expenses yet — start logging!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Add expense form */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Log Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <select
                value={newExpense.category}
                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                className="input-field"
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number" min="0" step="0.01" placeholder="Amount ($)"
                value={newExpense.amount}
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text" placeholder="Description (optional)"
                value={newExpense.description}
                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                className="input-field"
              />
              <button type="submit" className="btn-primary w-full">Add Expense</button>
            </form>
          </div>

          {/* Transactions list */}
          <div className="glass-card p-5 rounded-2xl max-h-72 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {budgetData.expenses.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No transactions yet.</p>
              )}
              {[...budgetData.expenses].reverse().map(exp => (
                <div key={exp._id} className="flex justify-between items-center bg-gray-800/60 p-3 rounded-xl group">
                  <div>
                    <p className="font-medium text-gray-200 text-sm">{exp.category}</p>
                    {exp.description && <p className="text-xs text-gray-500">{exp.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-400 text-sm">-${exp.amount}</span>
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
                    >×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;
