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
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        input::placeholder {
          color: #8E9297;
        }
      `}</style>
      <div className="max-w-lg w-full bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl p-12 border border-gray-700/50" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-8" style={{ marginBottom: '32px' }}>
          <h1 className="text-white/95" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>ChatterBox</h1>
          <p className="text-gray-300" style={{ fontSize: '14px', color: '#B9BBBE', marginBottom: '24px' }}>Create your account</p>
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
              className={`w-full px-5 py-4 rounded-lg bg-gray-700/80 backdrop-blur-sm border transition-all outline-none text-white/95 ${
                errors.username ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-600/70 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              }`}
              style={{ fontSize: '16px', color: '#FFFFFF', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your username"
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
              className={`w-full px-5 py-4 rounded-lg bg-gray-700/80 backdrop-blur-sm border transition-all outline-none text-white/95 ${
                errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-600/70 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              }`}
              style={{ fontSize: '16px', color: '#FFFFFF', paddingTop: '14px', paddingBottom: '14px' }}
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
              className={`w-full px-5 py-4 rounded-lg bg-gray-700/80 backdrop-blur-sm border transition-all outline-none text-white/95 ${
                errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-600/70 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              }`}
              style={{ fontSize: '16px', color: '#FFFFFF', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Enter your password"
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
              className={`w-full px-5 py-4 rounded-lg bg-gray-700/80 backdrop-blur-sm border transition-all outline-none text-white/95 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-600/70 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              }`}
              style={{ fontSize: '16px', color: '#FFFFFF', paddingTop: '14px', paddingBottom: '14px' }}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
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
            className="w-full text-white/95 py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            style={{ 
              fontSize: '16px', 
              backgroundColor: '#5865F2',
              marginTop: '12px',
              paddingTop: '14px',
              paddingBottom: '14px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4E5D94'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5865F2'}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center" style={{ fontSize: '14px', marginTop: '24px' }}>
          <span className="text-gray-300">Already have an account? </span>
          <Link to="/login" className="font-medium hover:underline" style={{ color: '#7289DA' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
