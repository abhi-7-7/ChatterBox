// backend/server.js

console.log("server.js page is running")

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

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

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ChatterBox API is running!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Undefined route handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Server start
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
  console.log(`Server up and running at http://localhost:${PORT}`)
});
