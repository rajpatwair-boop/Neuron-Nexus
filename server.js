require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chatbot';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing without database (chat history will not be saved)');
  }
};

// Routes
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 AI Chatbot Server Running`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   POST /api/chat         - Send message`);
    console.log(`   GET  /api/chat/history/:userId - Get history`);
    console.log(`   DELETE /api/chat/history/:userId - Clear history`);
    console.log(`   GET  /api/health       - Health check`);
    console.log(`\n⚙️  Environment:`);
    console.log(`   OpenRouter API: ${process.env.OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chatbot'}`);
    console.log('');
  });
};

startServer();