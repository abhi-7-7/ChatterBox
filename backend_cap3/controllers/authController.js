const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Generate JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
  let expiresIn = (process.env.JWT_EXPIRE || '30d').trim();
  if (!/^(\d+[smhd]|\d+)$/.test(expiresIn)) {
    expiresIn = '30d';
  }
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const signup = async (req, res) => {
  try {
    const { username, email, password, fullName, location, website } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email },{ username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, fullName, location, website, role: 'Member' }
    });
    const token = generateToken(newUser.id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        location: newUser.location,
        website: newUser.website,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl || null
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        location: user.location,
        website: user.website,
        role: user.role,
        avatarUrl: user.avatarUrl || null
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
const getMe = async (req, res) => {
  try {
    const userId = req.user?.id; 
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, username: true, email: true, createdAt: true, avatarUrl: true, fullName: true, location: true, website: true, role: true }
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update profile (username, profile fields). ID and email are immutable.
const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, fullName, location, website, avatarUrl } = req.body;

    if (email && email.trim()) {
      return res.status(400).json({ success: false, message: 'Email cannot be changed' });
    }

    if (!username && !fullName && !location && !website && avatarUrl === undefined) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    // validate unique username
    if (username) {
      const existing = await prisma.user.findFirst({ where: { username, NOT: { id: userId } } });
      if (existing) return res.status(400).json({ success: false, message: 'Username already in use' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { 
        username: username || undefined, 
        fullName: fullName || undefined, 
        location: location || undefined, 
        website: website || undefined,
        avatarUrl: avatarUrl === null ? null : avatarUrl || undefined
      },
      select: { id: true, username: true, email: true, avatarUrl: true, createdAt: true, fullName: true, location: true, website: true, role: true }
    });

    res.status(200).json({ success: true, user: updated });
  } catch (error) {
    console.error('Update Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'oldPassword and newPassword required' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating password' });
  }
};

// Delete user and related chat/messages
const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // delete messages, chat participants, chats owned by user (and messages) via transactions
    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { OR: [{ userId }, { chat: { userId } }] } });
      await tx.chatParticipant.deleteMany({ where: { userId } });
      // delete chats owned by user (and their messages already deleted above)
      await tx.chat.deleteMany({ where: { userId } });
      await tx.activity.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting account' });
  }
};
module.exports = { signup, login, getMe, updateMe, updatePassword, deleteMe };