// backend/routes/chatRoutes.js

const express = require('express');
const {
  createChat,
  getAllChats,
  getChatById,
  updateChat,
  deleteChat
  , findOrCreateChat
  , clearChatMessages
  , getDashboardStats
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/chats - Create new chat
router.post('/', createChat);

// GET /api/chats - Get all chats (with pagination, search, sort, filter)
router.get('/', getAllChats);

// GET /api/chats/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Find or create chat for a provider (e.g., GPT, Gemini) - returns chat object
router.post('/find-or-create', findOrCreateChat);

// GET /api/chats/:id - Get single chat
router.get('/:id', getChatById);

// PUT /api/chats/:id - Update chat
router.put('/:id', updateChat);

// DELETE /api/chats/:id - Delete chat
router.delete('/:id', deleteChat);

// DELETE messages only (keep chat) - useful to refresh a congested thread without losing chat metadata
router.delete('/:id/messages', clearChatMessages);

module.exports = router;
