import api from './api';

export const searchCities = async (query = '') => {
  const response = await api.get(`/cities/search?q=${query}`);
  return response.data;
};

export const getCityActivities = async (cityId) => {
  const response = await api.get(`/cities/${cityId}/activities`);
  return response.data;
};
