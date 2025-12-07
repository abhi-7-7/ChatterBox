// backend/routes/messageRoutes.js

const express = require('express');
const {
  createMessage,
  getMessagesByChatId,
  updateMessage,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/messages - Create new message
router.post('/', createMessage);

// GET /api/messages/:chatId - Get all messages for a chat (with pagination, search, sort, filter)
router.get('/:chatId', getMessagesByChatId);

// PUT /api/messages/:id - Update message
router.put('/:id', updateMessage);

// DELETE /api/messages/:id - Delete message
router.delete('/:id', deleteMessage);

module.exports = router;
