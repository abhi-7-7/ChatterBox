// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      // Check database connection
      // if (!checkConnection()) {
      //   return res.status(503).json({
      //     success: false,
      //     message: 'Database not connected. Please connect database and try again.'
      //   });
      // }

      // const pool = getPool();

      // Get user from database (excluding password)
      const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Attach minimal user info to request object
      req.user = { id: user.id, username: user.username, email: user.email };
      return next();

    } catch (error) {
      console.error('Auth Middleware Error:', error);
      
      // Handle JWT errors
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token failed'
        });
      }

      // Handle database connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({
          success: false,
          message: 'Database connection error. Please check database connection.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = { protect };