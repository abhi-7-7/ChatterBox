const path = require('path');
const { prisma } = require('../config/database');

// public upload endpoint (no auth required)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url });
  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};

// upload avatar and attach to user's record
const uploadAvatar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const updated = await prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl: url }, select: { id: true, avatarUrl: true } });
    res.status(200).json({ success: true, avatarUrl: updated.avatarUrl });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ success: false, message: 'Server error while saving avatar' });
  }
};

module.exports = { uploadFile, uploadAvatar };
