const { prisma } = require('../config/database');

// Helper to normalize date to UTC date-only (start of day)
const startOfDay = (d) => {
  const dt = new Date(d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
};

const getActivity = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const rows = await prisma.activity.findMany({ where: { userId }, orderBy: { date: 'asc' } });
    const dates = rows.map((r) => r.date.toISOString());
    res.status(200).json({ success: true, dates });
  } catch (error) {
    console.error('Get Activity Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching activity' });
  }
};

const addTodayActivity = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const today = startOfDay(new Date());

    // check existing
    const exists = await prisma.activity.findFirst({ where: { userId, date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } } });
    if (!exists) {
      await prisma.activity.create({ data: { userId, date: today } });
    }

    // compute streak: get all activity dates up to today
    const rows = await prisma.activity.findMany({ where: { userId, date: { lte: today } }, orderBy: { date: 'desc' } });
    let streak = 0;
    let cursor = startOfDay(new Date());
    for (let r of rows) {
      const d = startOfDay(r.date);
      if (d.getTime() === cursor.getTime()) {
        streak += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
      } else if (d.getTime() < cursor.getTime()) {
        break;
      }
    }

    res.status(200).json({ success: true, streak });
  } catch (error) {
    console.error('Add Activity Error:', error);
    res.status(500).json({ success: false, message: 'Server error adding activity' });
  }
};

module.exports = { getActivity, addTodayActivity };
