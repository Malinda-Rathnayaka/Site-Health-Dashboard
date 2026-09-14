import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so components can always read err.message and
// err.details regardless of whether it was a network failure, a validation
// error, or a server 500. The API's consistent envelope makes this easy.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const body = error.response.data;
      const message = body?.error?.message || 'Something went wrong. Please try again.';
      const details = body?.error?.details;
      return Promise.reject({ status: error.response.status, message, details });
    }
    if (error.request) {
      return Promise.reject({ status: 0, message: 'Cannot reach the server. Check your connection.' });
    }
    return Promise.reject({ status: -1, message: error.message || 'Unexpected error' });
  }
);

export default api;
