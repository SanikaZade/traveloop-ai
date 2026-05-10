import api from './api';

export const getPackingList = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/packing`);
  return response.data;
};

export const updatePackingList = async (tripId, categories) => {
  const response = await api.put(`/trips/${tripId}/packing`, { categories });
  return response.data;
};
