/**
 * AI Chatbot Feature - Floating Bottom Right
 * Isolated component - does not modify existing code
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        maxMessages: 50,
        typingDelay: 500,
        maxRetries: 3,
        conversationHistoryLimit: 10
    };

    // State
    let isOpen = false;
    let messages = [];
    let isTyping = false;
    let conversationHistory = []; // Store conversation context

    // Create DOM Elements
    function createChatbot() {
        // Container
        const container = document.createElement('div');
        container.id = 'ai-chatbot-container';
        container.innerHTML = `
            <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open AI Chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
            <div id="chatbot-panel" class="chatbot-panel">
                <div class="chatbot-header">
                    <span class="chatbot-title">AI Assistant</span>
                    <button id="chatbot-close" class="chatbot-close" aria-label="Close">&times;</button>
                </div>
                <div id="chatbot-messages" class="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Ask me anything..." maxlength="200">
                    <button id="chatbot-send" class="chatbot-send">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Add styles
        addStyles();

        // Bind events
        bindEvents();

        // Add welcome message
        addMessage('ai', 'Hello! I\'m your AI assistant. How can I help you today?');
    }

    function addStyles() {
        const style = document.createElement('style');
        style.id = 'chatbot-styles';
        style.textContent = `
            #ai-chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                font-family: var(--font-body, 'Inter', sans-serif);
            }

            .chatbot-toggle {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--accent-cyan, #00d4ff), var(--accent-cyan-dim, #0099cc));
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4), 0 0 30px rgba(0, 212, 255, 0.2);
                transition: all 0.3s ease;
                animation: chatbotPulse 2s ease-in-out infinite;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
            }

            .chatbot-toggle svg {
                width: 24px;
                height: 24px;
                color: #0a0a0f;
            }

            @keyframes chatbotPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); }
                50% { box-shadow: 0 4px 30px rgba(0, 212, 255, 0.7); }
            }

            .chatbot-panel {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 320px;
                height: 450px;
                background: rgba(10, 10, 15, 0.98);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.1);
            }

            .chatbot-panel.open {
                opacity: 1;
                visibility: visible;
                transform: scale(1) translateY(0);
            }

            .chatbot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid rgba(0, 212, 255, 0.2);
            }

            .chatbot-title {
                font-family: var(--font-heading, 'Orbitron', sans-serif);
                font-size: 14px;
                color: var(--accent-cyan, #00d4ff);
                letter-spacing: 0.1em;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: var(--text-muted, #888);
                font-size: 24px;
                cursor: pointer;
                transition: color 0.2s;
            }

            .chatbot-close:hover {
                color: var(--accent-cyan, #00d4ff);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(0, 212, 255, 0.3);
                border-radius: 2px;
            }

            .chat-message {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 13px;
                line-height: 1.5;
                animation: messageSlide 0.3s ease;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
            }

            .chat-message.user {
                align-self: flex-end;
                background: linear-gradient(135deg, var(--accent-cyan, #00d4ff), var(--accent-cyan-dim, #0099cc));
                color: #0a0a0f;
                border-bottom-right-radius: 4px;
            }

            .chat-message.ai {
                align-self: flex-start;
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid rgba(0, 212, 255, 0.2);
                color: var(--text-primary, #fff);
                border-bottom-left-radius: 4px;
            }

            .chat-message.typing {
                display: flex;
                gap: 4px;
                padding: 16px 14px;
            }

            .typing-dot {
                width: 6px;
                height: 6px;
                background: var(--accent-cyan, #00d4ff);
                border-radius: 50%;
                animation: typingBounce 1.4s ease-in-out infinite;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-8px); }
            }

            .chatbot-input-area {
                display: flex;
                gap: 8px;
                padding: 12px 16px;
                border-top: 1px solid rgba(0, 212, 255, 0.2);
            }

            #chatbot-input {
                flex: 1;
                background: rgba(0, 212, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.2);
                border-radius: 20px;
                padding: 10px 16px;
                color: var(--text-primary, #fff);
                font-size: 13px;
                outline: none;
                transition: border-color 0.2s;
            }

            #chatbot-input:focus {
                border-color: var(--accent-cyan, #00d4ff);
            }

            #chatbot-input::placeholder {
                color: var(--text-muted, #888);
            }

            .chatbot-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--accent-cyan, #00d4ff);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .chatbot-send:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
            }

            .chatbot-send svg {
                width: 18px;
                height: 18px;
                color: #0a0a0f;
            }

            @media (max-width: 480px) {
                .chatbot-panel {
                    width: calc(100vw - 40px);
                    right: -10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const panel = document.getElementById('chatbot-panel');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');

        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            panel.classList.toggle('open', isOpen);
            if (isOpen) input.focus();
        });

        close.addEventListener('click', () => {
            isOpen = false;
            panel.classList.remove('open');
        });

        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function addMessage(type, text) {
        const container = document.getElementById('chatbot-messages');
        const msg = document.createElement('div');
        msg.className = `chat-message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;

        messages.push({ type, text, time: Date.now() });
        if (messages.length > CONFIG.maxMessages) {
            messages.shift();
            container.removeChild(container.firstChild);
        }
    }

    function showTyping() {
        const container = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'chat-message ai typing';
        typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    async function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();
        
        // Input validation
        if (!text) {
            showInputHint('Please type a message first! 💬');
            return;
        }
        
        if (text.length < 2) {
            showInputHint('Message too short. Tell me more! 🤔');
            return;
        }
        
        if (isTyping) {
            showInputHint('Wait for my response... ⏳');
            return;
        }

        // Clear input and add user message
        input.value = '';
        addMessage('user', text);
        
        // Add to conversation history
        addToHistory('user', text);
        
        isTyping = true;
        showTyping();

        try {
            const response = await getAIResponse(text);
            hideTyping();
            
            // Validate response
            if (!response || response.trim().length < 5) {
                throw new Error('Empty or invalid response');
            }
            
            addMessage('ai', response);
            addToHistory('ai', response);
            
        } catch (error) {
            hideTyping();
            console.error('Chatbot error:', error);
            
            // Use smart fallback
            const fallbackResponse = getSmartFallbackResponse(text);
            addMessage('ai', fallbackResponse);
            addToHistory('ai', fallbackResponse);
        }

        isTyping = false;
    }
    
    function showInputHint(message) {
        const input = document.getElementById('chatbot-input');
        const originalPlaceholder = input.placeholder;
        input.placeholder = message;
        input.style.borderColor = '#ff4444';
        
        setTimeout(() => {
            input.placeholder = originalPlaceholder;
            input.style.borderColor = '';
        }, 2000);
    }
    
    function addToHistory(role, content) {
        conversationHistory.push({ role, content, timestamp: Date.now() });
        
        // Keep only recent history
        if (conversationHistory.length > CONFIG.conversationHistoryLimit) {
            conversationHistory = conversationHistory.slice(-CONFIG.conversationHistoryLimit);
        }
        
        // Persist to localStorage
        try {
            localStorage.setItem('neuroquest_chat_history', JSON.stringify(conversationHistory));
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    function loadHistory() {
        try {
            const saved = localStorage.getItem('neuroquest_chat_history');
            if (saved) {
                conversationHistory = JSON.parse(saved);
            }
        } catch (e) {
            conversationHistory = [];
        }
    }

    // Smart AI Response System with Retry Logic and Fallback
    async function getAIResponse(message, retryCount = 0) {
        const RETRY_DELAY = 1000;
        
        // STEP 1: Check intent-based responses first (instant reply)
        if (typeof window.IntentChatbot !== 'undefined') {
            const intentResponse = window.IntentChatbot.getIntentBasedResponse(message);
            if (intentResponse) {
                console.log('⚡ Intent-based response (instant)');
                return intentResponse;
            }
        }
        
        // STEP 2: Build conversation context from history
        const contextMessages = buildContextMessages(message);
        
        // System prompt for consistent, focused responses
        const systemPrompt = `You are NeuroQuest AI, an intelligent and friendly tutor for a gamified learning platform.

YOUR PERSONALITY:
- Enthusiastic, encouraging, and patient
- Use simple language, avoid jargon unless explaining it
- Always end with a question or suggestion to keep conversation flowing
- Keep responses concise (2-4 sentences max)

YOUR GOALS:
1. Help users learn step-by-step
2. Suggest quizzes, battles, or profile checks when relevant
3. Ask follow-up questions to understand their needs
4. Be motivating and positive

PLATFORM FEATURES TO MENTION:
- Story Mode: Learn through immersive narratives
- Battle Mode: Compete against AI opponents
- Practice Mode: Master at your own pace
- Profile: Track XP, levels, and achievements

RULES:
- Never give one-word answers
- Always provide examples when explaining concepts
- If unsure, guide users to try a quiz on the topic
- Use emojis occasionally (not excessively)`;
        
        // API endpoints to try in order
        const apiEndpoints = [
            {
                name: 'Gemini',
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDemoKeyForTestingOnly',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: () => JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'model', parts: [{ text: 'I understand! I am NeuroQuest AI, ready to help students learn in a fun and engaging way.' }] },
                        ...contextMessages.map(m => ({
                            role: m.role === 'user' ? 'user' : 'model',
                            parts: [{ text: m.content }]
                        }))
                    ],
                    generationConfig: { 
                        temperature: 0.8, 
                        maxOutputTokens: 250, 
                        topP: 0.9,
                        topK: 40
                    }
                }),
                extract: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
            },
            {
                name: 'Groq',
                url: 'https://api.groq.com/openai/v1/chat/completions',
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer gsk_demo_key'
                },
                body: () => JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...contextMessages
                    ],
                    max_tokens: 250,
                    temperature: 0.8
                }),
                extract: (data) => data.choices?.[0]?.message?.content
            }
        ];
        
        // Try each API with retries
        for (let apiIndex = 0; apiIndex < apiEndpoints.length; apiIndex++) {
            const api = apiEndpoints[apiIndex];
            let attempts = 0;
            
            while (attempts <= retryCount) {
                try {
                    console.log(`AI: Trying ${api.name} API (attempt ${attempts + 1})...`);
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
                    
                    const response = await fetch(api.url, {
                        method: api.method,
                        headers: api.headers,
                        body: api.body(),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`${api.name} HTTP ${response.status}`);
                    }
                    
                    const data = await response.json();
                    const text = api.extract(data);
                    
                    if (text && text.trim().length > 10) {
                        console.log(`AI: ${api.name} responded successfully ✅`);
                        return cleanResponse(text.trim());
                    }
                    
                    throw new Error(`${api.name} returned empty or short response`);
                    
                } catch (error) {
                    console.warn(`AI: ${api.name} failed - ${error.message}`);
                    attempts++;
                    
                    if (attempts <= retryCount) {
                        console.log(`AI: Retrying ${api.name} in ${RETRY_DELAY}ms...`);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    }
                }
            }
        }
        
        // All APIs failed
        throw new Error('All APIs failed');
    }
    
    // Build conversation context for API
    function buildContextMessages(currentMessage) {
        const messages = [];
        
        // Add recent conversation history
        const recentHistory = conversationHistory.slice(-6); // Last 6 messages
        
        for (const msg of recentHistory) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }
        
        // Add current message
        messages.push({
            role: 'user',
            content: currentMessage
        });
        
        return messages;
    }
    
    // Clean and validate API response
    function cleanResponse(text) {
        // Remove any system-like prefixes
        text = text.replace(/^(Assistant|AI|Bot):\s*/i, '');
        
        // Ensure it ends with punctuation or question mark
        if (!text.match(/[.!?]$/)) {
            text += '.';
        }
        
        // Limit length
        if (text.length > 500) {
            text = text.substring(0, 497) + '...';
        }
        
        return text;
    }
    
    // Interactive AI Tutor with Smart Teaching
    function getSmartFallbackResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Check for learning topics first
        const topicResponses = getTopicResponse(lowerMsg, message);
        if (topicResponses) return topicResponses;
        
        // Comprehensive response database with tutor personality
        const responses = {
            greetings: {
                keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
                responses: [
                    "Hey there! 🚀 Ready to level up your knowledge today?\n\nWhat subject are you curious about? Or should we jump straight into a quiz?",
                    "Hello! Welcome back to NeuroQuest! 🎯\n\nWhat would you like to explore today? I'm here to help you learn!",
                    "Hi! I'm your learning companion! 💡\n\nNeed help with a topic, or are you ready to test your skills in Battle Mode?"
                ]
            },
            help: {
                keywords: ['help', 'assist', 'support', 'how to', 'what can you do'],
                responses: [
                    "I'm here to be your learning buddy! 📚\n\nI can:\n🎯 **Explain topics** - Step by step, nice and simple\n⚔️ **Prep you for battles** - Practice makes perfect!\n📊 **Track progress** - See how far you've come\n🤔 **Answer questions** - No question is too small\n\nWhat do you want to tackle first?",
                    "Need a hand? I've got you! 💪\n\nTell me:\n• What subject you're studying\n• What concept is tricky\n• Or if you just want to quiz yourself!\n\nWhat's on your mind?"
                ]
            },
            quiz: {
                keywords: ['quiz', 'test', 'question', 'practice', 'exam'],
                responses: [
                    "🎯 **Love the enthusiasm!**\n\nQuizzes are the best way to learn. Here's how to start:\n\n1. Pick a subject from your dashboard\n2. Choose your mode:\n   • **Story Mode** - Learn as you go 📖\n   • **Battle Mode** - Race against AI ⚔️\n   • **Practice Mode** - No pressure, just learning ✏️\n\nWhich mode sounds fun to you?",
                    "Quizzes = XP = Leveling up! 🚀\n\nThe more you answer, the stronger you get. Plus, Battle Mode is super exciting - nothing beats the thrill of a good competition!\n\nWant to try a quick practice round first, or go straight to battle?"
                ]
            },
            battle: {
                keywords: ['battle', 'compete', 'vs', 'opponent', 'race', 'challenge'],
                responses: [
                    "⚔️ **Oh, you want to battle? I like it!** 🔥\n\nHere's the deal:\n• Answer faster than your AI opponent\n• Speed + Accuracy = Victory\n• Win = Bonus XP + Bragging rights!\n\nBut here's a pro tip: Practice the subject first so you're ready. Want me to help you review any topics before you jump in?",
                    "Battle Mode is where legends are made! 🏆\n\nYou'll face off against AI opponents in real-time. The questions get harder as you level up, but so do your rewards!\n\nQuick question: What subject do you feel most confident in? That's your best bet for winning!"
                ]
            },
            profile: {
                keywords: ['profile', 'xp', 'level', 'progress', 'achievement', 'stats', 'streak'],
                responses: [
                    "📊 **Your profile is your learning story!**\n\nEvery point of XP represents knowledge gained. Here's what to track:\n• **Level** - Shows your growth 📈\n• **XP** - Proof of your effort 💪\n• **Streak** - Consistency is key 🔥\n• **Achievements** - Badges of honor 🏅\n\nHow's your streak looking? Keeping it alive gives bonus XP!",
                    "Your profile = your learning identity! 🎯\n\nI love seeing those numbers go up. Pro tip: Even 10 minutes of practice keeps your streak alive. Small daily habits = massive progress!\n\nWant to check your weakest subject so we can improve it together?"
                ]
            },
            subjects: {
                keywords: ['subject', 'topic', 'course', 'programming', 'physics', 'math', 'chemistry', 'biology', 'history'],
                responses: [
                    "📚 **So many subjects, so much to learn!**\n\nWe have 8 amazing areas:\n💻 Programming (C, Java, Python, DSA)\n⚛️ Physics\n🧪 Chemistry\n🧬 Biology\n📐 Mathematics\n🏛️ History\n🌍 Geography\n🎯 General Knowledge\n\nWhich one excites you most? Or should I suggest one based on your current level?",
                    "Each subject has its own adventure! 🌟\n\nProgramming is perfect if you love logic puzzles. Physics if you're curious about how things work. History if stories fascinate you.\n\nWhat kind of learner are you? Hands-on, visual, or do you love reading?"
                ]
            },
            motivation: {
                keywords: ['motivate', 'inspire', 'encourage', 'tired', 'bored', 'hard', 'difficult', 'struggling'],
                responses: [
                    "💪 **Hey, I hear you. Learning can be tough.**\n\nBut here's the thing: Every expert you admire once struggled with the basics. The difference? They didn't give up.\n\nLet's make this easier:\n• Take a 5-minute break 🧘\n• Come back to just ONE small concept\n• Or switch to a different subject for variety\n\nWhat sounds doable right now?",
                    "Struggling means you're growing! 🌱\n\nSeriously - if it feels hard, your brain is literally building new connections. That's awesome!\n\nLet's try a different approach:\n🎯 Switch to Practice Mode (no pressure)\n📚 Review easier topics first\n⚔️ Do a battle to make it fun\n\nWhich option sounds good?"
                ]
            },
            thanks: {
                keywords: ['thanks', 'thank you', 'appreciate', 'grateful', 'ty'],
                responses: [
                    "You're so welcome! 🎉\n\nKeep that curiosity alive - it's your superpower! What should we explore next?",
                    "Anytime! Love helping you learn 🌟\n\nReady for another question, or should we jump into some practice?"
                ]
            },
            bye: {
                keywords: ['bye', 'goodbye', 'see you', 'cya', 'later'],
                responses: [
                    "See you later! 🚀\n\nDon't forget to keep that streak alive - even a quick quiz counts! Come back soon!",
                    "Bye for now! 💪\n\nRemember: Small steps every day = massive progress. See you in the next session!"
                ]
            }
        };
        
        // Find matching category
        for (const category of Object.values(responses)) {
            if (category.keywords.some(kw => lowerMsg.includes(kw))) {
                return category.responses[Math.floor(Math.random() * category.responses.length)];
            }
        }
        
        // Default engaging fallback with tutor personality
        return getCuriousResponse(message);
    }
    
    // Topic-based educational responses
    function getTopicResponse(lowerMsg, originalMsg) {
        // Programming topics
        if (lowerMsg.includes('array') || lowerMsg.includes('arrays')) {
            return `Nice, arrays are super important! 🔥

Let's start simple:
An **array** is like a numbered list where you store multiple values in order.

**Example:**
\`\`\`
[1, 2, 3, 4]
\`\`\`

Each item has an **index** (position), starting from 0.

👉 **Quick question:**
Do you want to learn this in **JavaScript** or **C++**?

Or should I give you a quick practice question about arrays?`;
        }
        
        if (lowerMsg.includes('loop') || lowerMsg.includes('loops') || lowerMsg.includes('for') || lowerMsg.includes('while')) {
            return `Loops are how we make computers do repetitive tasks! 🔄

Think of it like this:
- **For loop** = "Do this exactly 10 times"
- **While loop** = "Keep doing this until something changes"

**Example (counting to 5):**
\`\`\`
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
\`\`\`

👉 **Want to try this?**
Can you guess what this loop prints? Or should I show you a while loop example?`;
        }
        
        if (lowerMsg.includes('function') || lowerMsg.includes('functions') || lowerMsg.includes('method')) {
            return `Functions are like mini-programs inside your program! 📦

They take **input** → do **work** → give **output**

**Example:**
\`\`\`
function greet(name) {
    return "Hello, " + name + "!";
}
\`\`\`

Now you can use \`greet("Alice")\` anywhere!

👉 **Quick challenge:**
Can you write a function that adds two numbers?

Or want me to show you first?`;
        }
        
        if (lowerMsg.includes('variable') || lowerMsg.includes('variables') || lowerMsg.includes('var') || lowerMsg.includes('let') || lowerMsg.includes('const')) {
            return `Variables are like labeled boxes where you store data! 📦

**Think of it this way:**
- \`let age = 20;\` = "Put the number 20 in a box labeled 'age'"

**Three types:**
• \`var\` - Old way (avoid if possible)
• \`let\` - Can change the value later
• \`const\` - Value stays the same

👉 **Question:**
When would you use \`const\` instead of \`let\`?

Take a guess, then I'll explain!`;
        }
        
        // Physics topics
        if (lowerMsg.includes('newton') || lowerMsg.includes('force') || lowerMsg.includes('motion')) {
            return `Newton's Laws - the rules that run the universe! 🌍

**Law 1:** Objects stay still or keep moving unless something pushes them.

**Law 2:** Force = Mass × Acceleration (F = ma)

**Law 3:** Every action has an equal and opposite reaction.

**Real example:** When you jump, you push down on Earth, and Earth pushes you up! 🚀

👉 **Let's make this fun:**
Want to see how this applies in Battle Mode physics questions?

Or should I explain F = ma with a simple example?`;
        }
        
        if (lowerMsg.includes('gravity') || lowerMsg.includes('gravitation')) {
            return `Gravity - the invisible force that keeps us grounded! 🍎

**Key idea:** Every object pulls on every other object.

Earth pulls you down → You fall
You pull on Earth → (But Earth is HUGE so it barely notices!)

**Fun fact:** On the Moon, you weigh 1/6th of your Earth weight!

👉 **Quick question:**
If you drop a feather and a hammer on the Moon, which hits the ground first?

Want to guess before I tell you?`;
        }
        
        // Math topics
        if (lowerMsg.includes('equation') || lowerMsg.includes('algebra') || lowerMsg.includes('solve')) {
            return `Algebra is like solving puzzles with numbers and letters! 🧩

**The goal:** Find what the letter (variable) equals.

**Example:**
\`\`\`
2x + 4 = 10

Step 1: Subtract 4 from both sides
2x = 6

Step 2: Divide both sides by 2
x = 3
\`\`\`

👉 **Want to try one?**
Solve: 3x + 5 = 20

Take your time, or I can walk you through it!`;
        }
        
        if (lowerMsg.includes('derivative') || lowerMsg.includes('calculus') || lowerMsg.includes('differentiation')) {
            return `Derivatives = Rate of change! 📈

**Simple idea:** How fast is something changing right now?

**Real examples:**
• Speed = derivative of position
• Acceleration = derivative of speed
• Slope of a curve at any point

**Example:**
If position = t², then speed = 2t

At t=3 seconds, speed = 6 m/s

👉 **Does this make sense so far?**

Or should I show you a graph to visualize it better?`;
        }
        
        // Chemistry topics
        if (lowerMsg.includes('atom') || lowerMsg.includes('atomic') || lowerMsg.includes('molecule')) {
            return `Atoms - the building blocks of EVERYTHING! ⚛️

**Structure:**
• **Protons** (+) in the center
• **Neutrons** (neutral) in the center  
• **Electrons** (-) orbiting around

**Fun fact:** If an atom were a football stadium, the nucleus would be a pea in the center!

👉 **Quick question:**
What determines what element an atom is?

(Hint: It's about the number of something...)`;
        }
        
        if (lowerMsg.includes('periodic table') || lowerMsg.includes('element') || lowerMsg.includes('elements')) {
            return `The Periodic Table - chemistry's greatest hits! 🎵

**Organization:**
• **Rows** = Periods (energy levels)
• **Columns** = Groups (similar properties)

**Key areas:**
• Left side = Metals (conduct electricity)
• Right side = Non-metals
• Middle = Transition metals

**Pro tip:** Elements in the same column behave similarly!

👉 **Want to test this?**
Sodium (Na) and Potassium (K) are in the same column. What property do they share?

Take a guess!`;
        }
        
        return null; // No topic match found
    }
    
    // Curious, engaging default response
    function getCuriousResponse(message) {
        const curiousResponses = [
            `Interesting question! 🤔 Let me think about that...

While I process, here's something fun:

🎯 **Did you know?** The best way to learn is to teach someone else!

Maybe try explaining what you're learning to a friend (or even to me!)?

Or we could:
• Jump into a quick quiz
• Try Battle Mode
• Review your profile progress

What sounds good?`,

            `Hmm, that's a good one! 💭

I'm always learning too! Here's what I suggest:

**Option 1:** Break this into smaller questions
**Option 2:** Try a practice quiz on this topic
**Option 3:** Check if we have a specific lesson on this

Which approach feels right to you?`,

            `Great question! 🌟

I want to make sure I give you the best answer. Can you tell me:

👉 What subject is this about?
👉 Are you a beginner or looking for advanced stuff?
👉 Do you want theory or practice examples?

This helps me tailor my answer just for you!`,

            `Ooh, I love curious minds! 🚀

Here's a thought: Sometimes the best way to understand something is to try it!

Want to:
⚔️ **Battle Mode** - Test your knowledge under pressure
📝 **Practice Mode** - Learn at your own pace
📊 **Check your profile** - See what topics you've mastered

Learning by doing beats just reading, right?`
        ];
        
        return curiousResponses[Math.floor(Math.random() * curiousResponses.length)];
    }
    
    // Error response with tutor personality
    function getErrorResponse() {
        return `⚠️ I'm having a small connection issue right now, but I've got you covered! 😊

Meanwhile, you can:
👉 Try a quick quiz
👉 Enter battle mode  
👉 Review your profile progress
👉 Or ask me something else!

Your learning doesn't have to stop - which option sounds fun?`;
    }

    // Initialize when DOM is ready
    function init() {
        loadHistory();
        createChatbot();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();