import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  cost: {
    type: Number,
    default: 0
  },
  duration: String,
  type: String // Adventure, Food, Culture, etc.
});

const stopSchema = new mongoose.Schema({
  id: { // uuid for react-beautiful-dnd
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: String,
  startDate: Date,
  endDate: Date,
  notes: String,
  activities: [activitySchema]
});

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  stops: [stopSchema]
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
