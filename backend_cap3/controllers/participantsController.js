const { prisma } = require('../config/database');

const addParticipant = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const { userId, role } = req.body;
    if (isNaN(chatId) || !userId) return res.status(400).json({ success: false, message: 'Invalid input' });

    const uid = parseInt(userId);
    if (isNaN(uid)) return res.status(400).json({ success: false, message: 'Invalid userId' });

    // create if not exists
    await prisma.chatParticipant.createMany({ data: [{ chatId, userId: uid, role: role || null }], skipDuplicates: true });

    const chat = await prisma.chat.findUnique({ where: { id: chatId }, include: { participants: { include: { user: { select: { id: true, username: true, email: true, avatarUrl: true } } } }, messages: true, user: true, _count: { select: { messages: true } } } });

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('Add Participant Error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding participant' });
  }
};

const removeParticipant = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    if (isNaN(chatId) || isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid input' });

    await prisma.chatParticipant.deleteMany({ where: { chatId, userId } });

    const chat = await prisma.chat.findUnique({ where: { id: chatId }, include: { participants: { include: { user: { select: { id: true, username: true, email: true, avatarUrl: true } } } }, messages: true, user: true, _count: { select: { messages: true } } } });

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('Remove Participant Error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing participant' });
  }
};

module.exports = { addParticipant, removeParticipant };
