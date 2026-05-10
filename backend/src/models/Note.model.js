import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'bg-gray-800'
  }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
