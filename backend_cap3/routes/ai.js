const express = require('express');
const axios = require('axios');
const { prisma } = require('../config/database');

const router = express.Router();

// Helper to save AI reply to messages table if chatId provided
const saveAIMessage = async (chatId, engine, text) => {
  try {
    if (!chatId) return null;
    const msg = await prisma.message.create({
      data: {
        text: text || '',
        chatId: parseInt(chatId),
        senderId: engine,
        type: 'ai'
      }
    });
    return msg;
  } catch (e) {
    console.error('Failed to save AI message:', e.message);
    return null;
  }
};

router.post('/gpt', async (req, res) => {
  const { prompt, chatId } = req.body;
  try {
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
    }

    const r = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const assistant = r.data.choices?.[0]?.message?.content || '';

    // streaming support: if client requested stream, chunk response
    if (req.body.stream) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      // simple chunking without delays
      const size = 80;
      for (let i = 0; i < assistant.length; i += size) {
        res.write(assistant.slice(i, i + size));
      }
      // save AI reply to DB if chatId provided
      await saveAIMessage(chatId, 'gpt', assistant);
      return res.end();
    }

    // save AI reply to DB if chatId provided
    await saveAIMessage(chatId, 'gpt', assistant);

    res.json({ success: true, assistant });
  } catch (error) {
    console.error('GPT error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'OpenAI API error' });
  }
});

router.post('/gemini', async (req, res) => {
  const { prompt, chatId } = req.body;
  try {
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Gemini API key not configured' });
    }

    const r = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const assistant = r.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (req.body.stream) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const size = 80;
      for (let i = 0; i < assistant.length; i += size) res.write(assistant.slice(i, i + size));
      await saveAIMessage(chatId, 'gemini', assistant);
      return res.end();
    }
    
    await saveAIMessage(chatId, 'gemini', assistant);
    res.json({ success: true, assistant });
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.error?.message || error.message || 'Gemini API error';
    res.status(500).json({ success: false, error: errorMsg });
  }
});

router.post('/deepseek', async (req, res) => {
  const { prompt, chatId } = req.body;
  try {
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({ success: false, error: 'DeepSeek API key not configured' });
    }

    const r = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }]
      },
      { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` } }
    );

    const assistant = r.data.choices?.[0]?.message?.content || '';
    
    if (req.body.stream) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const size = 80;
      for (let i = 0; i < assistant.length; i += size) res.write(assistant.slice(i, i + size));
      await saveAIMessage(chatId, 'deepseek', assistant);
      return res.end();
    }
    
    await saveAIMessage(chatId, 'deepseek', assistant);
    res.json({ success: true, assistant });
  } catch (error) {
    console.error('DeepSeek error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'DeepSeek API error' });
  }
});

module.exports = router;
