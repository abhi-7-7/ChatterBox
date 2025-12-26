// frontend/src/utils/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.signup(userData);
      
      // Check if response has required data
      if (!response.data || !response.data.token) {
        return { success: false, message: 'Invalid response from server' };
      }
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle different error types
      let message = 'Signup failed';
      
      if (err.response) {
        // Server responded with error
        message = err.response.data?.message || err.response.data?.error || 'Signup failed';
      } else if (err.request) {
        // Request was made but no response received
        message = 'Cannot connect to server. Please check if the backend server is running.';
      } else if (err.message) {
        // Error in request setup
        message = err.message;
      } else {
        message = 'An unexpected error occurred';
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.login(userData);
      
      // Check if response has required data
      if (!response.data || !response.data.token) {
        return { success: false, message: 'Invalid response from server' };
      }
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error types
      let message = 'Login failed';
      
      if (err.response) {
        // Server responded with error
        message = err.response.data?.message || err.response.data?.error || 'Login failed';
      } else if (err.request) {
        // Request was made but no response received
        message = 'Cannot connect to server. Please check if the backend server is running.';
      } else if (err.message) {
        // Error in request setup
        message = err.message;
      } else {
        message = 'An unexpected error occurred';
      }
      
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (partial) => {
    setUser((prev) => ({ ...prev, ...partial }));
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};