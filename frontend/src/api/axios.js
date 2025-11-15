import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API base
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: auto-logout if token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.reload(); // force login again
    }
    return Promise.reject(error);
  }
);

export default api;
