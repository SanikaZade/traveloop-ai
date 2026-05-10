import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
