import db from '../../../utils/jsonDb.js';

export const getTrips = async (req, res) => {
  const trips = await db.findMany('trips', { owner: req.user.id });
  res.status(200).json({ success: true, count: trips.length, data: trips });
};

export const createTrip = async (req, res) => {
  const trip = await db.create('trips', { ...req.body, owner: req.user.id });
  res.status(201).json({ success: true, data: trip });
};

export const getTrip = async (req, res) => {
  const trip = await db.findOne('trips', { _id: req.params.id });
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.status(200).json({ success: true, data: trip });
};

export const updateTrip = async (req, res) => {
  const trip = await db.findByIdAndUpdate('trips', req.params.id, req.body);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.status(200).json({ success: true, data: trip });
};

export const deleteTrip = async (req, res) => {
  await db.findByIdAndDelete('trips', req.params.id);
  res.status(200).json({ success: true, data: {} });
};
