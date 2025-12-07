const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { updateMe, updatePassword, deleteMe } = require('../controllers/authController');
const { upload } = require('../middleware/upload');
const { uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

// Protected profile management
router.put('/me', protect, updateMe);
router.put('/password', protect, updatePassword);
router.post('/avatar', protect, upload.single('file'), uploadAvatar);
router.delete('/me', protect, deleteMe);

module.exports = router;
