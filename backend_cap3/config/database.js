// backend/config/database.js

const mysql = require('mysql2');
require('dotenv').config();

// Database connection state
let isConnected = false;
let pool = null;
let promisePool = null;

// Initialize database connection pool
const initializePool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'chatterbox_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Don't throw error immediately if connection fails
      connectTimeout: 10000
    });

    // Convert pool to use promises
    promisePool = pool.promise();
  }
  return promisePool;
};

// Get pool instance (lazy initialization)
const getPool = () => {
  if (!promisePool) {
    initializePool();
  }
  return promisePool;
};

// Test database connection (non-blocking)
const testConnection = async () => {
  try {
    const poolInstance = getPool();
    const connection = await poolInstance.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    isConnected = true;
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️  Database Connection Not Available:', error.message);
    
    // Provide specific error messages
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Authentication failed. Please check:');
      console.log('   1. MySQL username is correct');
      console.log('   2. MySQL password is correct in .env file');
      console.log('   3. MySQL user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('❌ Database not found. Please run the SQL commands to create the database.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to MySQL server. Make sure MySQL is running.');
    } else {
      console.log('📝 Server will run without database. Connect database later.');
    }
    
    isConnected = false;
    return false;
  }
};

// Check if database is connected
const checkConnection = () => {
  return isConnected;
};

module.exports = { 
  pool: getPool(), 
  testConnection, 
  checkConnection,
  getPool
};