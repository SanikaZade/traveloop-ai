import db from '../../../utils/jsonDb.js';

export const getNotes = async (req, res) => {
  const notes = await db.findMany('notes', { tripId: req.params.tripId });
  res.status(200).json({ success: true, data: notes });
};

export const createNote = async (req, res) => {
  const note = await db.create('notes', { ...req.body, tripId: req.params.tripId });
  res.status(201).json({ success: true, data: note });
};

export const deleteNote = async (req, res) => {
  await db.findByIdAndDelete('notes', req.params.id);
  res.status(200).json({ success: true, data: {} });
};
