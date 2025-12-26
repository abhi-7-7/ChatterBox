// backend/routes/notes.js

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
// Use the standard auth guard (named `protect` across the project)
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Create or update note
router.post('/', noteController.upsertNote);

// Get notes by month
router.get('/month', noteController.getNotesByMonth);

// Get note by date
router.get('/date/:date', noteController.getNoteByDate);

// Search notes
router.get('/search', noteController.searchNotes);

// Get all notes with activities
router.get('/with-activities', noteController.getNotesWithActivities);

// Delete note
router.delete('/date/:date', noteController.deleteNote);

module.exports = router;
