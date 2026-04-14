const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const geminiService = require('../services/geminiService');

// POST /chat - Send message and get AI response
router.post('/chat', async (req, res) => {
  try {
    const { message, mode, userId } = req.body;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    const validMode = ['study', 'coding', 'general'].includes(mode) ? mode : 'general';

    // Find or create chat for this user and mode
    let chat = await Chat.findOne({ userId, mode: validMode });
    
    if (!chat) {
      chat = new Chat({ userId, mode: validMode, messages: [] });
    }

    // Add user message to history
    chat.messages.push({
      role: 'user',
      content: message.trim()
    });

    // Get AI response with context
    const chatHistory = chat.messages.slice(-20); // Last 20 messages for context
    const aiResponse = await geminiService.generateResponse(
      message.trim(),
      validMode,
      chatHistory
    );

    // Add AI response to history
    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    // Save to database
    await chat.save();

    res.json({
      success: true,
      response: aiResponse,
      mode: validMode,
      messageCount: chat.messages.length
    });

  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /chat/history/:userId - Get chat history for user
router.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { mode } = req.query;

    const query = { userId };
    if (mode && ['study', 'coding', 'general'].includes(mode)) {
      query.mode = mode;
    }

    const chats = await Chat.find(query)
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      chats: chats.map(chat => ({
        id: chat._id,
        mode: chat.mode,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history'
    });
  }
});

// DELETE /chat/history/:userId - Clear chat history
router.delete('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { mode } = req.query;

    const query = { userId };
    if (mode) {
      query.mode = mode;
    }

    await Chat.deleteMany(query);

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat history'
    });
  }
});

module.exports = router;