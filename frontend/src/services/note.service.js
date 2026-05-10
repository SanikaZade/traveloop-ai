import api from './api';

export const getNotes = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/notes`);
  return response.data;
};

export const createNote = async (tripId, data) => {
  const response = await api.post(`/trips/${tripId}/notes`, data);
  return response.data;
};

export const updateNote = async (tripId, noteId, data) => {
  const response = await api.put(`/trips/${tripId}/notes/${noteId}`, data);
  return response.data;
};

export const deleteNote = async (tripId, noteId) => {
  const response = await api.delete(`/trips/${tripId}/notes/${noteId}`);
  return response.data;
};
