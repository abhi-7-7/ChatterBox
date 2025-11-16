// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, checkConnection } = require('../config/database');

// Generate JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
  // Trim and validate expiresIn value, default to 30d if invalid
  let expiresIn = (process.env.JWT_EXPIRE || '30d').trim();
  
  // Validate format (should be like "7d", "30d", "24h", "3600", etc.)
  if (!/^(\d+[smhd]|\d+)$/.test(expiresIn)) {
    expiresIn = '30d'; // Default to 30 days if invalid format
  }
  
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn }
  );
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation: Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    // Validation: Email format
    //TODO: Change regex logic instead use slice/splice function 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validation: Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check database connection
    if (!checkConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please connect database and try again.'
      });
    }

    const pool = getPool();

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into database
    // Note: role defaults to 'member' as per schema ENUM('guest', 'member', 'moderator')
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'member']
    );

    // Generate JWT token
    const token = generateToken(result.insertId);

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        email,
        role: 'member'
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    
    // Handle database-specific errors
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please check database connection.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check database connection
    if (!checkConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please connect database and try again.'
      });
    }

    const pool = getPool();

    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'member'
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    
    // Handle database-specific errors
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please check database connection.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Check database connection
    if (!checkConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please connect database and try again.'
      });
    }

    const pool = getPool();

    const [users] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Get Me Error:', error);
    
    // Handle database-specific errors
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please check database connection.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { signup, login, getMe };