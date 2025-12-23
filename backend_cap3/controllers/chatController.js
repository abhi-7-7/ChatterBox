const { prisma } = require('../config/database');
const createChat = async (req, res) => {
  try {
    const { title, participantIds } = req.body;
    const userId = req.user.id;

    // participantIds is required
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one participant ID is required' 
      });
    }

    // Validate participant IDs
    const ids = participantIds.map((i) => parseInt(i)).filter(id => !isNaN(id) && id > 0);
    if (ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid participant IDs provided' 
      });
    }

    // If title is not provided, fetch from the first participant (usually the user being added)
    let chatTitle = title;
    if (!chatTitle || !chatTitle.trim()) {
      // Get the first participant (who is being added to the chat)
      const firstParticipant = await prisma.user.findUnique({
        where: { id: ids[0] },
        select: { username: true }
      });

      if (!firstParticipant) {
        return res.status(404).json({ 
          success: false, 
          message: 'Participant user not found' 
        });
      }

      chatTitle = firstParticipant.username || `Chat with User ${ids[0]}`;
    }

    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle.trim(),
        userId
      },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        messages: true
      }
    });

    // Combine current user with provided participant IDs (ensure uniqueness)
    const uniqueIds = Array.from(new Set([userId, ...ids]));
    const participantCreates = uniqueIds.map((uid) => ({ chatId: newChat.id, userId: uid }));
    await prisma.chatParticipant.createMany({ data: participantCreates, skipDuplicates: true });

    const chatWithParticipants = await prisma.chat.findUnique({
      where: { id: newChat.id },
      include: { participants: { include: { user: { select: { id: true, username: true } } } }, messages: true }
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat: chatWithParticipants
    });

  } catch (error) {
    console.error('Create Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating chat' 
    });
  }
};

const findOrCreateChat = async (req, res) => {
  try {
    const { provider, title } = req.body;
    const userId = req.user.id;

    if (!provider && !title) {
      return res.status(400).json({ success: false, message: 'provider or title is required' });
    }
    const chatTitle = title || `${provider} Assistant`;
    let chat = await prisma.chat.findFirst({
      where: { title: chatTitle, userId },
      include: { messages: true }
    });
    if (!chat) {
      chat = await prisma.chat.create({
        data: { title: chatTitle, userId },
        include: { messages: true }
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('FindOrCreate Chat Error:', error);
    res.status(500).json({ success: false, message: 'Server error while finding/creating chat' });
  }
};

const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || ''
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const whereClause = {
      AND: [
        ...(search ? [{ title: { contains: search, mode: 'insensitive' } }] : []),
        ...(startDate && endDate ? [{ createdAt: { gte: startDate, lte: endDate } }] : []),
      ]
    };
    const totalChats = await prisma.chat.count({
      where: {
        AND: whereClause.AND,
        OR: [{ userId }, { participants: { some: { userId } } }]
      }
    });

    const chats = await prisma.chat.findMany({
      where: {
        AND: whereClause.AND,
        OR: [{ userId }, { participants: { some: { userId } } }]
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        participants: { include: { user: { select: { id: true, username: true } } } },
        _count: {
          select: { messages: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      chats,
      total: totalChats,
      page,
      limit
    });

  } catch (error) {
    console.error('Get All Chats Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching chats' 
    });
  }
};
const getChatById = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(chatId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid chat ID' 
      });
    }
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        user: { select: { id: true, username: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' }, include: { user: { select: { id: true, username: true } } } },
        participants: { include: { user: { select: { id: true, username: true } } } }
      }
    });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    const isParticipant = chat.participants.some((p) => p.userId === userId);
    if (chat.userId !== userId && !isParticipant) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      chat
    });

  } catch (error) {
    console.error('Get Chat By ID Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching chat' 
    });
  }
};
const updateChat = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title } = req.body;

    if (isNaN(chatId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid chat ID' 
      });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat title is required' 
      });
    }
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId }
    });
    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found or access denied' 
      });
    }
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: title.trim() },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        _count: {
          select: { messages: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      chat: updatedChat
    });

  } catch (error) {
    console.error('Update Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating chat' 
    });
  }
};
const deleteChat = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(chatId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid chat ID' 
      });
    }
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId }
    });

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found or access denied' 
      });
    }

    // Delete in order: Messages → ChatParticipants → Chat
    await prisma.message.deleteMany({
      where: { chatId }
    });

    await prisma.chatParticipant.deleteMany({
      where: { chatId }
    });

    await prisma.chat.delete({
      where: { id: chatId }
    });

    res.status(200).json({
      success: true,
      message: 'Chat, all messages, and participant records deleted successfully'
    });
  } catch (error) {
    console.error('Delete Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting chat' 
    });
  }
};

const clearChatMessages = async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(chatId)) {
      return res.status(400).json({ success: false, message: 'Invalid chat ID' });
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
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.message.deleteMany({ where: { chatId } });

    res.status(200).json({
      success: true,
      message: 'Chat messages cleared successfully'
    });
  } catch (error) {
    console.error('Clear Chat Messages Error:', error);
    res.status(500).json({ success: false, message: 'Server error while clearing chat messages' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's chats
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { userId },
          { participants: { some: { userId } } }
        ]
      },
      include: {
        messages: {
          select: { id: true, createdAt: true }
        },
        participants: true
      }
    });

    // Calculate total messages
    let totalMessages = 0;
    chats.forEach(chat => {
      totalMessages += chat.messages.length;
    });

    // Get message counts per day for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const messageCounts = {};
    const userCounts = {};

    // Initialize counts for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const key = date.toISOString().split('T')[0];
      messageCounts[key] = 0;
      userCounts[key] = new Set();
    }

    // Count messages and active users per day
    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        const msgDate = new Date(msg.createdAt).toISOString().split('T')[0];
        if (messageCounts[msgDate] !== undefined) {
          messageCounts[msgDate]++;
        }
      });

      // Add chat participants as active users
      chat.participants.forEach(p => {
        const dates = Object.keys(userCounts);
        dates.forEach(date => {
          userCounts[date].add(p.userId);
        });
      });
    });

    // Convert to arrays
    const messageData = Object.values(messageCounts);
    const userData = Object.keys(userCounts).map(key => userCounts[key].size);

    // Generate sample bar data (you can customize this based on your needs)
    const barData = messageData.map(count => Math.floor(count * 0.8));

    res.status(200).json({
      success: true,
      data: {
        totalChats: chats.length,
        totalMessages,
        groups: chats.filter(c => c.participants.length > 2).length,
        shared: Math.floor(totalMessages * 0.1), // Estimate
        graph: {
          messages: messageData,
          users: userData,
          bars: barData,
          days: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        },
        growth: {
          chats: chats.filter(c => {
            const created = new Date(c.createdAt);
            return created >= sevenDaysAgo;
          }).length,
          messages: messageData.reduce((a, b) => a + b, 0),
          days: 7
        }
      }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching dashboard stats' });
  }
};

module.exports = {createChat,getAllChats,getChatById,updateChat,deleteChat,findOrCreateChat,clearChatMessages,getDashboardStats};