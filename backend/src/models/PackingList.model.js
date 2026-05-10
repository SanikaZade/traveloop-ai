import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isPacked: {
    type: Boolean,
    default: false
  }
});

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  items: [itemSchema]
});

const packingListSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  categories: [categorySchema]
}, { timestamps: true });

export default mongoose.model('PackingList', packingListSchema);
