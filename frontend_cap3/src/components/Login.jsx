// frontend/src/pages/Login.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-app">
      <div className="absolute inset-0 gradient-soft opacity-40" />
      <div className="max-w-lg w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border-2 border-white/40 animate-fade-in relative z-10" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-8" style={{ marginBottom: '32px' }}>
          <div className="inline-block bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 p-4 rounded-2xl shadow-lg mb-4">
            <h1 className="text-white" style={{ fontSize: '32px', fontWeight: 'extrabold', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>ChatterBox</h1>
          </div>
          <p className="text-gray-700 font-semibold" style={{ fontSize: '18px', marginBottom: '8px' }}>Welcome back!</p>
            <p className="text-gray-500" style={{ fontSize: '14px' }}>Sign in to continue your conversations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" style={{ gap: '24px' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-md border-2 transition-all outline-none text-gray-800 font-medium shadow-sm hover:shadow-md ${
                errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-md border-2 transition-all outline-none text-gray-800 font-medium shadow-sm hover:shadow-md ${
                errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-4 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-105 bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 border-2 border-white/30"
            style={{ 
              fontSize: '17px',
              marginTop: '12px',
              paddingTop: '14px',
              paddingBottom: '14px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center" style={{ fontSize: '15px', marginTop: '24px' }}>
          <span className="text-gray-600 font-medium">Don't have an account? </span>
          <Link to="/signup" className="font-bold hover:underline text-blue-600 hover:text-blue-700 transition-colors">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;