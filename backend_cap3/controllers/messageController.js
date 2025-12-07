const { prisma } = require('../config/database');
const createMessage = async (req, res) => {
  try {
    const { text, chatId, senderId, type } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message text is required' 
      });
    }

    if (!chatId || isNaN(parseInt(chatId))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid chat ID is required' 
      });
    }
    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
      include: { participants: true }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    if (userId) {
      const isParticipant = chat.participants.some((p) => p.userId === userId);
      if (chat.userId !== userId && !isParticipant) {
        return res.status(403).json({ success: false, message: 'Access denied to this chat' });
      }
    }

    const createData = {
      text: text.trim(),
      chatId: parseInt(chatId),
      type: type || 'text'
    };

    if (userId) {
      createData.userId = userId;
    }

    if (senderId) {
      createData.senderId = String(senderId);
    }

    const newMessage = await prisma.message.create({
      data: createData,
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        chat: {
          select: { id: true, title: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Create Message Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating message' 
    });
  }
};
const getMessagesByChatId = async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = req.user.id;

    if (isNaN(chatId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid chat ID' 
      });
    }
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const isParticipant = chat.userId === userId || (chat.participants || []).some((p) => p.userId === userId);
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Access denied to this chat' });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const whereClause = {
      chatId,
      ...(search && {
        text: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      })
    };
    const totalMessages = await prisma.message.count({ where: whereClause });
    const messages = await prisma.message.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      messages,
      total: totalMessages,
      page,
      limit
    });

  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching messages' 
    });
  }
};
const updateMessage = async (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;
    const { text } = req.body;

    if (isNaN(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message text is required' 
      });
    }
    const message = await prisma.message.findFirst({
      where: { id: messageId, userId }
    });

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found or access denied' 
      });
    }
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { text: text.trim() },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        chat: {
          select: { id: true, title: true }
        }
      }
    });
    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Update Message Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating message' 
    });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }
    const message = await prisma.message.findFirst({
      where: { id: messageId, userId }
    });
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found or access denied' 
      });
    }
    await prisma.message.delete({
      where: { id: messageId }
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete Message Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting message' 
    });
  }
};

module.exports = {createMessage,getMessagesByChatId,updateMessage,deleteMessage};