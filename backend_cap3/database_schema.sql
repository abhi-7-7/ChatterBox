-- ChatterBox Database Schema
-- Run this SQL script to create the database and users table

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS chatterbox_db;

-- Step 2: Switch to it
USE chatterbox_db;

-- Step 3: Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('guest', 'member', 'moderator') DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 4: Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);

-- Step 5: Verify
DESCRIBE users;

