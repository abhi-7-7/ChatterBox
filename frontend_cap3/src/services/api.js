// frontend/src/services/api.js

import axios from 'axios'

const rawBackend = (import.meta.env.VITE_BACKEND_URL || '').trim();
const backend = rawBackend ? rawBackend.replace(/\/$/, '') : 'http://localhost:8000';
// console.log("========", backend, rawBackend)
// Create axios instance with base URL (no trailing slash so we always use leading '/' in paths)
const API = axios.create({
  baseURL: backend,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout
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
  signup: (userData) => API.post('/api/auth/signup', userData),
  login: (userData) => API.post('/api/auth/login', userData),
  getMe: () => API.get('/api/auth/me')
};

// Chat API calls
export const chatAPI = {
  // Create a new chat
  createChat: (data) => API.post('/api/chats', data),

  // Get all user's chats with optional filters
  getMyChats: (params = {}) => API.get('/api/chats', { params }),

  // Get chat by ID
  getChatById: (chatId) => API.get(`/api/chats/${chatId}`),

  // Update chat (rename)
  updateChat: (chatId, data) => API.put(`/api/chats/${chatId}`, data),

  // Delete chat
  deleteChat: (chatId) => API.delete(`/api/chats/${chatId}`),

  // Clear all messages in a chat but keep the chat itself
  clearChatMessages: (chatId) => API.delete(`/api/chats/${chatId}/messages`),

  // find or create provider chat
  findOrCreate: (data) => API.post('/api/chats/find-or-create', data)
};

// Participant API calls
export const participantAPI = {
  removeSelf: (chatId, userId) => API.delete(`/api/chats/${chatId}/participants/${userId}`),
};

// Message API calls
export const messageAPI = {
  // Send a new message
  sendMessage: (data) => API.post('/api/messages', data),

  // Get messages for a chat
  getMessages: (chatId, params = {}) => API.get(`/api/messages/${chatId}`, { params }),

  // Update a message
  updateMessage: (messageId, data) => API.put(`/api/messages/${messageId}`, data),

  // Delete a message
  deleteMessage: (messageId) => API.delete(`/api/messages/${messageId}`),

  // Paginated helper
  getMessagesPaginated: (chatId, page = 1, limit = 50) => API.get(`/api/messages/${chatId}`, { params: { page, limit } })
};

// AI API calls
export const aiAPI = {
  gpt: (data) => { console.log(API); return API.post('/api/ai/gpt', data); },
  gemini: (data) => API.post('/api/ai/gemini', data),
  deepseek: (data) => API.post('/api/ai/deepseek', data)
};

export default API;