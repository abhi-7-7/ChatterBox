const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addParticipant, removeParticipant } = require('../controllers/participantsController');

const router = express.Router();

router.post('/chats/:id/participants', protect, addParticipant);
router.delete('/chats/:id/participants/:userId', protect, removeParticipant);

module.exports = router;
