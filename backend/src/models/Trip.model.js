import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05' // Default travel image
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  totalBudget: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
