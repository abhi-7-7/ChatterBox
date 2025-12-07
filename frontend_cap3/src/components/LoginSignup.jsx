import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

import {
  MessageSquare,Mail,Lock,User,ArrowRight,Sun,Moon,Brush,Loader2
} from 'lucide-react';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState('login'); // login | signup
  const [theme, setTheme] = useState('light');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const [loading, setLoading] = useState({ login: false, signup: false });
  const [errors, setErrors] = useState({});

  /** THEME SYSTEM */
  const themeColors = {
    light: {
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      bgGradient: "from-blue-50 via-pink-50 to-cyan-50",
      loginBg: "from-cyan-400 via-blue-400 to-teal-400",
      signupBg: "bg-white",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      inputBg: "bg-white/60",
      inputText: "text-gray-800",
      inputPlaceholder: "placeholder-gray-500",
      border: "border-blue-200",
      cardBg: "bg-white/70",
    },
    dark: {
      gradient: "from-gray-700 via-gray-800 to-gray-900",
      bgGradient: "from-gray-900 via-gray-800 to-gray-900",
      loginBg: "from-gray-700 via-gray-800 to-gray-900",
      signupBg: "bg-gray-800",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      inputBg: "bg-gray-700/60",
      inputText: "text-gray-100",
      inputPlaceholder: "placeholder-gray-400",
      border: "border-gray-600",
      cardBg: "bg-gray-800/70",
    },
    vintage: {
      gradient: "from-orange-400 via-amber-400 to-yellow-400",
      bgGradient: "from-amber-50 via-orange-50 to-yellow-50",
      loginBg: "from-orange-400 via-amber-500 to-yellow-500",
      signupBg: "bg-amber-50",
      text: "text-amber-900",
      textSecondary: "text-amber-700",
      inputBg: "bg-amber-100/60",
      inputText: "text-amber-900",
      inputPlaceholder: "placeholder-amber-600",
      border: "border-amber-300",
      cardBg: "bg-amber-50/70",
    },
  };

  const currentTheme = themeColors[theme];

  /** Toggle Light → Dark → Vintage → Light */
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('vintage');
    else setTheme('light');
  };

  /** Apply theme variables globally */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = 'var(--color-bg)';
  }, [theme]);

  /** Switch Login <-> Signup */
  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  /** LOGIN HANDLERS */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [`login_${name}`]: '' }));
  };

  const validateLogin = () => {
    const err = {};
    if (!loginData.email.trim()) err.login_email = "Email is required";
    if (!loginData.password.trim()) err.login_password = "Password is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(prev => ({ ...prev, login: true }));
    const result = await login(loginData);
    setLoading(prev => ({ ...prev, login: false }));

    if (result.success) navigate('/dashboard');
    else setErrors(prev => ({ ...prev, login_submit: result.message }));
  };

  /** SIGNUP HANDLERS */
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [`signup_${name}`]: '' }));
  };

  const validateSignup = () => {
    const err = {};

    if (!signupData.name.trim()) err.signup_name = "Name is required";
    if (!signupData.email.trim()) err.signup_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email))
      err.signup_email = "Invalid email format";

    if (!signupData.password.trim()) err.signup_password = "Password is required";
    else if (signupData.password.length < 6)
      err.signup_password = "Password must be at least 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
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

    if (result.success) navigate('/dashboard');
    else setErrors(prev => ({ ...prev, signup_submit: result.message }));
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row relative animate-fade-in">

      {/* THEME BUTTON */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 ${currentTheme.cardBg} backdrop-blur-xl px-4 py-4 rounded-2xl border-2 ${currentTheme.border} transition-all shadow-xl hover:scale-110`}
      >
        {theme === 'light' && <Sun className={`${currentTheme.text} w-7 h-7`} />}
        {theme === 'dark' && <Moon className={`${currentTheme.text} w-7 h-7`} />}
        {theme === 'vintage' && <Brush className={`${currentTheme.text} w-7 h-7`} />}
      </button>

      {/* LEFT SIDE — LOGIN */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center px-10 py-20 overflow-hidden">

        <div className={`absolute inset-0 bg-linear-to-br ${currentTheme.loginBg} opacity-90`} />

        <div className="relative z-10 w-full max-w-lg text-center space-y-10">

          <div className="inline-flex items-center space-x-4 bg-white/20 px-8 py-4 rounded-3xl backdrop-blur-2xl shadow-xl">
            <MessageSquare className="w-10 h-10 text-white" />
            <span className="text-3xl font-extrabold text-white">ChatterBox</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white">Welcome Back!</h1>
          <p className="text-xl text-white/90">Sign in to continue your conversations</p>

          {/* LOGIN FORM */}
          <div
            className={`transition-all duration-500 ${
              mode === 'login'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <form onSubmit={handleLoginSubmit} className="space-y-6">

              {/* EMAIL */}
              <div className="text-left space-y-3">
                <label className="text-white text-sm font-medium block">
                  Email Address
                </label>

                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-white/20 border border-white/30 text-white shadow-md">
                    <Mail className="w-5 h-5" />
                  </span>

                  <div className={`flex-1 rounded-2xl bg-white/10 border ${errors.login_email ? 'border-red-500' : 'border-white/25'} shadow-inner`}> 
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Enter your email"
                      className="w-full px-5 py-4 rounded-2xl bg-transparent text-white placeholder-white/70 outline-none"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {errors.login_email && (
                  <p className="text-red-200 text-sm mt-1">{errors.login_email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="text-left space-y-3">
                <label className="text-white text-sm font-medium block">Password</label>

                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-white/20 border border-white/30 text-white shadow-md">
                    <Lock className="w-5 h-5" />
                  </span>

                  <div className={`flex-1 rounded-2xl bg-white/10 border ${errors.login_password ? 'border-red-500' : 'border-white/25'} shadow-inner`}>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className="w-full px-5 py-5 rounded-2xl bg-transparent text-white placeholder-white/70 outline-none"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {errors.login_password && <p className="text-red-200 text-sm">{errors.login_password}</p>}
              </div>

              {errors.login_submit && (
                <div className="bg-red-500/30 border border-red-400 text-white p-4 rounded-xl">
                  {errors.login_submit}
                </div>
              )}

              <button
                disabled={loading.login}
                type="submit"
                className="w-full py-5 rounded-2xl text-xl font-bold bg-white/20 border-2 border-white text-white backdrop-blur-md hover:bg-white/30 transition-all"
              >
                {loading.login ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "SIGN IN"}
              </button>

              <button
                type="button"
                onClick={switchMode}
                className="text-white/90 underline text-lg mt-4">
                Don't have an account? Create one
              </button>

            </form>
          </div>

          {/* LOGIN SIDE WELCOME (SHOWS WHEN SIGNUP MODE ACTIVE) */}
          <div
            className={`text-white space-y-6 transition-all duration-500 ${
              mode === 'signup'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <h2 className="text-4xl font-extrabold">Welcome Back!</h2>
            <p className="text-lg text-white/90">Already have an account? Sign in to continue chatting.</p>
            <button
              onClick={switchMode}
              className="px-8 py-4 bg-white/20 border-2 border-white backdrop-blur-md rounded-xl text-xl font-bold hover:bg-white/30">
              Sign In
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE — SIGNUP */}
      <div className={`w-full md:w-1/2 flex items-center justify-center px-10 py-20 ${currentTheme.signupBg}`}>

        <div className="w-full max-w-lg text-center space-y-10">

            <span className="inline-flex items-center space-x-3 bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 px-6 py-2 rounded-full text-white font-bold shadow-xl">
            <span>Join ChatterBox</span>
          </span>

          <h2 className={`text-5xl font-extrabold ${currentTheme.text}`}>Create Account</h2>
          <p className={`${currentTheme.textSecondary} text-lg`}>Start your journey with us today</p>

          <div
            className={`transition-all duration-500 ${
              mode === 'signup'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            {/* SIGNUP FORM */}
            <form onSubmit={handleSignupSubmit} className="space-y-6">

              {/* NAME */}
              <div className="text-left space-y-3">
                <label className={`${currentTheme.text} text-sm font-medium block`}>Full Name</label>

                <div className="flex items-center gap-3">
                  <span className={`p-3 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.inputText} shadow-md`}>
                    <User className="w-5 h-5" />
                  </span>

                  <div className={`flex-1 rounded-2xl ${currentTheme.inputBg} border-2 ${errors.signup_name ? 'border-red-500' : currentTheme.border}`}>
                    <input
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      placeholder="Enter your name"
                      className={`w-full px-5 py-4 rounded-2xl bg-transparent ${currentTheme.inputText} ${currentTheme.inputPlaceholder}`}
                      autoComplete="name"
                    />
                  </div>
                </div>

                {errors.signup_name && <p className="text-red-500 text-sm">{errors.signup_name}</p>}
              </div>

              {/* EMAIL */}
              <div className="text-left space-y-3">
                <label className={`${currentTheme.text} text-sm font-medium block`}>Email Address</label>

                <div className="flex items-center gap-3">
                  <span className={`p-3 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.inputText} shadow-md`}>
                    <Mail className="w-5 h-5" />
                  </span>

                  <div className={`flex-1 rounded-2xl ${currentTheme.inputBg} border-2 ${errors.signup_email ? 'border-red-500' : currentTheme.border}`}>
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="Enter your email"
                      className={`w-full px-5 py-4 rounded-2xl bg-transparent ${currentTheme.inputText} ${currentTheme.inputPlaceholder}`}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {errors.signup_email && <p className="text-red-500 text-sm">{errors.signup_email}</p>}
              </div>

              {/* PASSWORD */}
              <div className="text-left space-y-3">
                <label className={`${currentTheme.text} text-sm font-medium block`}>Password</label>

                <div className="flex items-center gap-3">
                  <span className={`p-3 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.inputText} shadow-md`}>
                    <Lock className="w-5 h-5" />
                  </span>

                  <div className={`flex-1 rounded-2xl ${currentTheme.inputBg} border-2 ${errors.signup_password ? 'border-red-500' : currentTheme.border}`}>
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password"
                      className={`w-full px-5 py-4 rounded-2xl bg-transparent ${currentTheme.inputText} ${currentTheme.inputPlaceholder}`}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {errors.signup_password && <p className="text-red-500 text-sm">{errors.signup_password}</p>}
              </div>

              {errors.signup_submit && (
                <div className="bg-red-100 border border-red-400 text-red-600 rounded-xl p-4">
                  {errors.signup_submit}
                </div>
              )}

              <button
                disabled={loading.signup}
                type="submit"
                className="w-full py-5 bg-linear-to-br from-cyan-400 via-blue-500 to-teal-400 rounded-2xl text-white text-xl font-bold shadow-xl hover:scale-105 transition-all border border-white/40"
              >
                {loading.signup ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "SIGN UP"
                )}
              </button>

              <button
                type="button"
                onClick={switchMode}
                className={`${currentTheme.textSecondary} underline text-lg mt-2`}>
                Already have an account? Sign in
              </button>

            </form>
          </div>

          {/* SIGNUP SIDE WELCOME (when mode = login) */}
          <div
            className={`text-center space-y-6 transition-all duration-500 ${
              mode === 'login'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <h2 className={`text-4xl font-extrabold ${currentTheme.text}`}>Hello, Friend!</h2>

            <p className={`${currentTheme.textSecondary} text-lg`}>
              Enter your details and start your journey with us today.
            </p>

            <button
              onClick={switchMode}
              className="px-8 py-4 bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 text-white rounded-xl text-xl font-bold shadow-lg hover:scale-105"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginSignup;
