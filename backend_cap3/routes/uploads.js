const express = require('express');
const { upload } = require('../middleware/upload');
const { uploadFile, uploadAvatar } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public file upload (no auth required for general uploads)
router.post('/', upload.single('file'), uploadFile);

// Avatar upload requires authentication
router.post('/avatar', protect, upload.single('file'), uploadAvatar);

module.exports = router;
