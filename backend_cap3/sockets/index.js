const { Server } = require('socket.io');
const { prisma } = require('../config/database');

function initSockets(server, options = {}) {
  const io = new Server(server, { cors: { origin: '*' }, ...options });

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    socket.on('chat:join', (chatId) => {
      try {
        socket.join(`chat_${chatId}`);
        io.to(`chat_${chatId}`).emit('presence:update', { chatId, userCount: io.sockets.adapter.rooms.get(`chat_${chatId}`)?.size || 0 });
      } catch (e) {
        console.error('chat:join error', e);
      }
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit('typing', { userId });
    });

    socket.on('message:send', async ({ chatId, text, senderId }) => {
      try {
        // persist message
        const m = await prisma.message.create({ data: { text: text || '', chatId: parseInt(chatId), senderId: senderId || null, type: 'text' }, include: { user: true } });
        const payload = { id: m.id, text: m.text, createdAt: m.createdAt, senderId: m.senderId, user: m.user };
        io.to(`chat_${chatId}`).emit('message:new', payload);
        io.emit('chat:update', { chatId });
      } catch (e) {
        console.error('message:send error', e);
      }
    });

    socket.on('disconnect', () => {
      // presence updates can be emitted as needed
    });
  });

  return io;
}

module.exports = { initSockets };
