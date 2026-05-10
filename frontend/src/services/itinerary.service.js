import api from './api';

export const getItinerary = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/itinerary`);
  return response.data;
};

export const updateItinerary = async (tripId, stops) => {
  const response = await api.put(`/trips/${tripId}/itinerary`, { stops });
  return response.data;
};
