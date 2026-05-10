import db from '../../../utils/jsonDb.js';

export const getPublicTrip = async (req, res) => {
  const { tripId } = req.params;
  const trip = await db.findOne('trips', { _id: tripId });
  
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  if (!trip.isPublic) return res.status(403).json({ success: false, message: 'This trip is private' });

  const itinerary = await db.findOne('itineraries', { tripId });

  res.status(200).json({ 
    success: true, 
    data: { trip, itinerary: itinerary || { stops: [] } } 
  });
};

export const copyPublicTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  const originalTrip = await db.findOne('trips', { _id: tripId });
  if (!originalTrip || !originalTrip.isPublic) {
    return res.status(404).json({ success: false, message: 'Trip not found or not public' });
  }

  const newTrip = await db.create('trips', {
    owner: userId,
    title: `Copy of ${originalTrip.title}`,
    destination: originalTrip.destination,
    startDate: originalTrip.startDate,
    endDate: originalTrip.endDate,
    coverImage: originalTrip.coverImage,
    isPublic: false
  });

  const originalItinerary = await db.findOne('itineraries', { tripId });
  if (originalItinerary) {
    await db.create('itineraries', {
      tripId: newTrip._id,
      stops: originalItinerary.stops.map(stop => ({ ...stop, _id: Math.random().toString(36).substr(2, 9) }))
    });
  }

  res.status(201).json({ success: true, data: newTrip });
};
