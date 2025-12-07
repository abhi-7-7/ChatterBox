// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const authManageRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { prisma, testConnection } = require('./config/database');
const aiRoutes = require("./routes/ai.js");
const uploadsRoutes = require('./routes/uploads');
const activityRoutes = require('./routes/activity');
const participantsRoutes = require('./routes/participants');
const path = require('path');
const fs = require('fs');


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',        
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']     
}));;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/ai", aiRoutes);

// Serve uploaded static files
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ChatterBox API is running!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authManageRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api', activityRoutes);
app.use('/api', participantsRoutes);
app.use('/api/ai', aiRoutes);

// Undefined route handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Server start
const PORT = process.env.PORT || 8000;

// Start server after DB connection test
(async () => {
  const ok = await testConnection();
  if (!ok) {
    console.error('Database connection failed — server will still start but some features may not work.');
  }

  const server = app.listen(PORT, () => {
    console.log(`Server up and running at http://localhost:${PORT}`);
  });

  // Start socket server (optional enhancement)
  try {
    const { initSockets } = require('./sockets');
    initSockets(server);
    console.log('Socket server initialized');
  } catch (e) {
    console.warn('Socket server failed to start:', e.message);
  }

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down server...');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
