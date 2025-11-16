import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({ login: false, signup: false });

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[`login_${name}`]) {
      setErrors(prev => ({
        ...prev,
        [`login_${name}`]: ''
      }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email.trim()) {
      newErrors.login_email = 'Email is required';
    }
    if (!loginData.password) {
      newErrors.login_password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(prev => ({ ...prev, login: true }));
    const result = await login(loginData);
    setLoading(prev => ({ ...prev, login: false }));

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(prev => ({ ...prev, login_submit: result.message }));
    }
  };

  // Signup handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[`signup_${name}`]) {
      setErrors(prev => ({
        ...prev,
        [`signup_${name}`]: ''
      }));
    }
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.name.trim()) {
      newErrors.signup_name = 'Name is required';
    }
    if (!signupData.email.trim()) {
      newErrors.signup_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.signup_email = 'Invalid email format';
    }
    if (!signupData.password) {
      newErrors.signup_password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.signup_password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(prev => ({ ...prev, signup: true }));
    const result = await signup({
      username: signupData.name,
      email: signupData.email,
      password: signupData.password
    });
    setLoading(prev => ({ ...prev, signup: false }));

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(prev => ({ ...prev, signup_submit: result.message }));
    }
  };

  // Social media icon components
  const FacebookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const GooglePlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 13.25h-2.25v2.25h-1.5v-2.25H12.344v-1.5h2.25V9.5h1.5v2.25h2.25v1.5zM7.5 10.5c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5c.691 0 1.306.281 1.75.735L10.5 5.5C9.578 4.625 8.6 4.25 7.5 4.25c-2.069 0-3.75 1.681-3.75 3.75s1.681 3.75 3.75 3.75c1.1 0 2.078-.375 3-1.25L9.25 10.265c-.444.454-1.059.735-1.75.735zm0-5c.827 0 1.5.673 1.5 1.5S8.327 8.5 7.5 8.5 6 7.827 6 7s.673-1.5 1.5-1.5z"/>
    </svg>
  );

  const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        input::placeholder {
          color: #999;
        }
      `}</style>
      
      {/* Left Column - Login Section */}
      <div 
        className="w-1/2 flex flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 50%, #ec4899 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        {/* Decorative shapes */}
        <div 
          className="absolute bottom-0 left-0"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(236, 72, 153, 0.3)',
            borderRadius: '50% 0 0 0',
            transform: 'translate(-30%, 30%)'
          }}
        />
        <div 
          className="absolute top-0 right-0"
          style={{
            width: '150px',
            height: '150px',
            background: 'rgba(239, 68, 68, 0.4)',
            borderRadius: '0 0 0 50%',
            transform: 'translate(30%, -30%)'
          }}
        />
        
        <div className="relative z-10 text-center text-white max-w-md">
          <h1 
            className="mb-6"
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              lineHeight: '1.2'
            }}
          >
            Welcome Back!
          </h1>
          <p 
            className="mb-8"
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              opacity: 0.95
            }}
          >
            To keep connected with us please login with your personal info
          </p>
          
          <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Email"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 ${
                  errors.login_email ? 'border-red-300 focus:ring-red-300' : 'border-white/50 focus:ring-white/50'
                }`}
                style={{ fontSize: '16px' }}
              />
              {errors.login_email && (
                <p className="text-red-200 text-sm mt-1">{errors.login_email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 ${
                  errors.login_password ? 'border-red-300 focus:ring-red-300' : 'border-white/50 focus:ring-white/50'
                }`}
                style={{ fontSize: '16px' }}
              />
              {errors.login_password && (
                <p className="text-red-200 text-sm mt-1">{errors.login_password}</p>
              )}
            </div>

            {errors.login_submit && (
              <div className="bg-red-500/20 border border-red-300 text-white px-4 py-3 rounded-lg text-sm">
                {errors.login_submit}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading.login}
              className="w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#14b8a6',
                border: '2px solid white',
                color: 'white'
              }}
            >
              {loading.login ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column - Sign-Up Section */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 
            className="mb-8 text-center"
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333'
            }}
          >
            Create Account
          </h2>
          
          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-6">
            <button
              type="button"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ backgroundColor: '#1877f2', color: 'white' }}
              aria-label="Sign up with Facebook"
            >
              <FacebookIcon />
            </button>
            <button
              type="button"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ backgroundColor: '#db4437', color: 'white' }}
              aria-label="Sign up with Google+"
            >
              <GooglePlusIcon />
            </button>
            <button
              type="button"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ backgroundColor: '#0077b5', color: 'white' }}
              aria-label="Sign up with LinkedIn"
            >
              <LinkedInIcon />
            </button>
          </div>
          
          <p 
            className="text-center mb-6"
            style={{ color: '#666', fontSize: '14px' }}
          >
            or use your email for registration:
          </p>
          
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                placeholder="Name"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.signup_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                }`}
                style={{ fontSize: '16px' }}
              />
              {errors.signup_name && (
                <p className="text-red-500 text-sm mt-1">{errors.signup_name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Email"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.signup_email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                }`}
                style={{ fontSize: '16px' }}
              />
              {errors.signup_email && (
                <p className="text-red-500 text-sm mt-1">{errors.signup_email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.signup_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                }`}
                style={{ fontSize: '16px' }}
              />
              {errors.signup_password && (
                <p className="text-red-500 text-sm mt-1">{errors.signup_password}</p>
              )}
            </div>

            {errors.signup_submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.signup_submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading.signup}
              className="w-full py-4 px-8 rounded-lg font-semibold text-lg text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#14b8a6',
                marginTop: '8px'
              }}
            >
              {loading.signup ? 'Signing up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;


