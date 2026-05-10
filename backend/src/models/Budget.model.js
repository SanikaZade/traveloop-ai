import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Transport', 'Food', 'Accommodation', 'Activities', 'Other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: Date
});

const budgetSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  totalBudget: {
    type: Number,
    required: true,
    default: 0
  },
  expenses: [expenseSchema]
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
