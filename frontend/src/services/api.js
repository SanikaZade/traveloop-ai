import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  // BUG-03: use relative path so the Vite proxy handles it in dev,
  // and VITE_API_URL handles it in production (Vercel → Render).
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      // JWT expired or invalid — clear session and redirect
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error(message || 'Access denied');
    } else if (status === 404) {
      // Don't toast 404s globally — let components handle them contextually
    } else if (status >= 500) {
      toast.error('Server error — please try again');
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
