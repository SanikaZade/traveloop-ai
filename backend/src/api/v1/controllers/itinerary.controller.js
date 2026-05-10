import db from '../../../utils/jsonDb.js';

export const getItinerary = async (req, res) => {
  const itinerary = await db.findOne('itineraries', { tripId: req.params.tripId });
  if (!itinerary) {
    return res.status(200).json({ success: true, data: { tripId: req.params.tripId, stops: [] } });
  }
  res.status(200).json({ success: true, data: itinerary });
};

export const updateItinerary = async (req, res) => {
  const { tripId } = req.params;
  const { stops } = req.body;

  let itinerary = await db.findOne('itineraries', { tripId });

  if (!itinerary) {
    itinerary = await db.create('itineraries', { tripId, stops });
  } else {
    itinerary = await db.findByIdAndUpdate('itineraries', tripId, { stops });
  }

  res.status(200).json({ success: true, data: itinerary });
};
