import api from './api';

export const getPublicTrip = async (tripId) => {
  const response = await api.get(`/public/trips/${tripId}`);
  return response.data;
};

export const copyPublicTrip = async (tripId) => {
  const response = await api.post(`/public/trips/${tripId}/copy`);
  return response.data;
};

// To toggle public status, we use standard Trip API
export const updateTripVisibility = async (tripId, isPublic) => {
  const response = await api.put(`/trips/${tripId}`, { isPublic });
  return response.data;
};
