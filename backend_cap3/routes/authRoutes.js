// backend/routes/authRoutes.js

const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (requires authentication)
router.get('/me', protect, getMe);

module.exports = router;