// frontend/src/services/api.js

import axios from 'axios'

const backend = import.meta.env.VITE_BACKEND_URL
console.log(backend);

// Create axios instance with base URL
const API = axios.create({
  baseURL: backend,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('API Error Request:', 'No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => API.post('api/auth/signup', userData),
  login: (userData) => API.post('api/auth/login', userData),
  getMe: () => API.get('api/auth/me')
};

export default API;