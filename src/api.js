import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vigor-backend-iznu.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Dieser "Interceptor" fängt jeden Request ab und fügt den Token hinzu, falls vorhanden
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
