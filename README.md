# 🤖 AI Chatbot Server

## Setup Instructions

### 1. Get OpenRouter API Key
1. Go to https://openrouter.ai/keys
2. Create a free account
3. Click "Create Key"
4. Copy your API key

### 2. Set API Key (Choose one method)

#### Method 1: Interactive Setup (Easiest)
```bash
npm run setup
# Then paste your API key when prompted
```

#### Method 2: Manual Setup
Edit the `.env` file and replace the placeholder:
```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### 3. Start Server
```bash
npm start
```

### 4. Open Chatbot
Open your browser to: http://localhost:3000

---

## Quick Start

```bash
# Install dependencies
npm install

# Set API key
npm run setup

# Start server
npm start
```

Then visit: http://localhost:3000

---

## Troubleshooting

### Error: "API key not configured"
- Make sure you set your real API key in `.env`
- The key should start with `sk-or-v1-`
- Run `npm run setup` to configure it

### Error: "Invalid API key"
- Check your key on https://openrouter.ai/keys
- Make sure it's active and has credits

### Server won't start
- Make sure port 3000 is not in use
- Run: `npm install` first

---

## API Documentation

### POST /api/chat
Send a message to the AI.

**Request:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI answer here",
  "model": "mistralai/mistral-7b-instruct"
}
```

### GET /api/health
Check if API is configured.

**Response:**
```json
{
  "status": "ok",
  "apiConfigured": true
}
```

---

## Features
- ✅ Answers any question
- ✅ Code examples with explanations
- ✅ Math problem solving
- ✅ Error handling
- ✅ Secure API key storage
- ✅ Modern chat UI

---

## Tech Stack
- **Backend:** Node.js + Express
- **AI API:** OpenRouter (Mistral 7B)
- **Frontend:** HTML + CSS + JavaScript