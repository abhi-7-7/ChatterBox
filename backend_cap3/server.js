// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ChatterBox API is running!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection (non-blocking)
    // Server will start even if database is not connected
    const dbConnected = await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      if (!dbConnected) {
        console.log('⚠️  Note: Database not connected. API will return appropriate errors.');
        console.log('📝 Connect database and restart server when ready.');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();