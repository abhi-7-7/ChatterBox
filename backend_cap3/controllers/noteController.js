// backend/controllers/noteController.js

const { prisma } = require('../config/database');

// Create or update a note
exports.upsertNote = async (req, res) => {
  try {
    const { date, content } = req.body;
    const userId = req.user.id;

    if (!date || content === undefined) {
      return res.status(400).json({ error: 'Date and content are required' });
    }

    const noteDate = new Date(date);
    noteDate.setHours(0, 0, 0, 0);

    // Check if note already exists for this date
    const existingNote = await prisma.note.findFirst({
      where: {
        userId,
        date: noteDate
      }
    });

    let note;
    if (existingNote) {
      // Update existing note
      note = await prisma.note.update({
        where: { id: existingNote.id },
        data: { content }
      });
    } else {
      // Create new note
      note = await prisma.note.create({
        data: {
          userId,
          date: noteDate,
          content
        }
      });
    }

    res.json({ success: true, note });
  } catch (error) {
    console.error('Upsert note error:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
};

// Get notes for a specific month
exports.getNotesByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const notes = await prisma.note.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get note for a specific date
exports.getNoteByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const noteDate = new Date(date);
    noteDate.setHours(0, 0, 0, 0);

    const note = await prisma.note.findFirst({
      where: {
        userId,
        date: noteDate
      }
    });

    res.json({ success: true, note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Search notes
exports.searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
        content: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: { date: 'desc' },
      take: 50
    });

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const targetDate = new Date(`${date}T00:00:00.000Z`);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Use UTC day range to avoid timezone mismatches (input is date-only)
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const result = await prisma.note.deleteMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ success: true, deleted: result.count, message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Get all notes with activities
exports.getNotesWithActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await prisma.note.findMany({
      where: { userId },
      include: {
        activity: true
      },
      orderBy: { date: 'desc' }
    });

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Get notes with activities error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};
