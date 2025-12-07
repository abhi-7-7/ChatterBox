const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getActivity, addTodayActivity } = require('../controllers/activityController');

const router = express.Router();

// Public read allowed, but posting requires auth in this setup
router.get('/users/:id/activity', protect, getActivity);
router.post('/users/:id/activity', protect, addTodayActivity);

module.exports = router;
