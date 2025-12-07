// frontend/src/pages/Signup.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

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
          <p className="text-gray-700 font-semibold" style={{ fontSize: '18px', marginBottom: '8px' }}>Create your account</p>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>Join ChatterBox and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" style={{ gap: '24px' }}>
          {/* Username Field */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all outline-none text-slate-900 ${
                errors.username ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-2">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all outline-none text-slate-900 ${
                errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your email"
              autoComplete="email"
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
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all outline-none text-slate-900 ${
                errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border transition-all outline-none text-slate-900 ${
                errors.confirmPassword ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
              style={{ fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-2xl mb-4">
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center" style={{ fontSize: '15px', marginTop: '24px' }}>
          <span className="text-gray-600 font-medium">Already have an account? </span>
          <Link to="/login" className="font-bold hover:underline text-blue-600 hover:text-blue-700 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
