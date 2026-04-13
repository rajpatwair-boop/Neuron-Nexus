/**
 * AI Chatbot - Google AI Studio (Gemini) Integration
 * Uses @google/generative-ai SDK with smart mode detection
 */

(function() {
    'use strict';

    // Google AI Studio Configuration
    // Get your API key from: https://aistudio.google.com/app/apikey
    const GEMINI_CONFIG = {
        apiKey: localStorage.getItem('gemini_api_key') || '', // User should set this
        model: 'gemini-1.5-flash',
        maxOutputTokens: 500,
        temperature: 0.7
    };
    
    // Demo responses for common academic questions (when API is unavailable)
    const DEMO_RESPONSES = {
        '2+2': `Step 1: Simple addition
2 + 2 = 4 ✅

👉 Practice:
1. What is 3 + 5?
2. What is 10 - 4?`,

        '2 + 2': `Step 1: Simple addition
2 + 2 = 4 ✅

👉 Practice:
1. What is 3 + 5?
2. What is 10 - 4?`,

        '5+5': `Step 1: Simple addition
5 + 5 = 10 ✅

👉 Practice:
1. What is 7 + 8?
2. What is 15 - 6?`,

        '10*10': `Step 1: Multiplication
10 × 10 = 100 ✅

👉 Practice:
1. What is 12 × 8?
2. What is 25 × 4?`,

        'hello': `Hello! 👋 I am your Academic AI Tutor. I can help with:
- Maths, Physics, Chemistry
- Computer Science & Coding
- Biology & English
- Aptitude & Competitive exams

What would you like to learn today?`,

        'hi': `Hi there! 🎓 I am your Academic AI Tutor for SSC, HSC, Engineering, and BSc levels.

Subjects: Maths, Physics, Chemistry, CS, Biology, English, Aptitude

What can I help you with?`,

        'what is an array': `An array is a data structure that stores multiple values in a single variable.

📋 Key Points:
- Values are stored in consecutive memory locations
- Each value has an index (starting from 0)
- Can store same type of data

Example in Python:
\`\`\`python
numbers = [10, 20, 30, 40]
print(numbers[0])  # Output: 10
print(numbers[2])  # Output: 30
\`\`\`

👉 Practice:
1. Create an array of 5 student marks
2. How do you access the last element?`,

        'what is newton first law': `Newton's First Law (Law of Inertia):

An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.

🌍 Real-World Examples:
1. When a bus suddenly stops, passengers fall forward
2. A book stays on the table until you push it
3. Satellites keep orbiting Earth (no air resistance in space)

🔑 Key Concept:
Objects resist changes to their state of motion.

👉 Practice:
1. Why do we wear seatbelts in cars?
2. What happens to a ball rolling on a perfectly smooth, frictionless surface?`,

        'what is osmosis': `Osmosis:

The movement of water molecules from a region of higher concentration to a region of lower concentration through a semi-permeable membrane.

🧪 Real Example:
- When you put raisins in water, they swell up
- Water moves into the raisin cells

🔑 Key Points:
- Only water/solvent moves
- From low solute to high solute concentration
- Through semi-permeable membrane

👉 Practice:
1. Why do plants wilt when too much fertilizer is added?
2. What happens to a blood cell in pure water?`,

        'what is photosynthesis': `Photosynthesis:

The process by which green plants use sunlight, water, and carbon dioxide to create glucose (food) and release oxygen.

🌱 Chemical Equation:
6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂

(Carbon dioxide + Water → Glucose + Oxygen)

🔑 Key Points:
- Occurs in chloroplasts (contain chlorophyll)
- Converts light energy to chemical energy
- Essential for life on Earth

👉 Practice:
1. Why are leaves green?
2. What happens to photosynthesis at night?`
    };

    // Configuration
    const CONFIG = {
        maxMessages: 50,
        typingDelay: 500,
        maxRetries: 2,
        apiTimeout: 15000,
        historyLimit: 8
    };

    // Google Generative AI instance
    let genAI = null;
    let model = null;

    // State
    let isOpen = false;
    let isTyping = false;
    let messageHistory = [];
    let chatContainer = null;

    // Initialize
    function init() {
        loadHistory();
        createChatbotUI();
        bindEvents();
        initGemini();
    }

    // Initialize Google Generative AI
    async function initGemini() {
        try {
            // Dynamically import the SDK
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            
            // Get API key from localStorage or use demo
            let apiKey = GEMINI_CONFIG.apiKey;
            
            // Check if we should show setup UI instead of prompt
            if (!apiKey && !window.geminiKeyPrompted) {
                console.log('⚠️ No Gemini API key found. Set it using: localStorage.setItem("gemini_api_key", "YOUR_KEY")');
                console.log('📝 Get free API key at: https://aistudio.google.com/app/apikey');
                showGeminiSetupHint();
            }
            
            if (apiKey && apiKey.length > 10) {
                genAI = new GoogleGenerativeAI(apiKey);
                model = genAI.getGenerativeModel({ 
                    model: GEMINI_CONFIG.model,
                    generationConfig: {
                        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
                        temperature: GEMINI_CONFIG.temperature
                    }
                });
                console.log('✅ Gemini AI initialized with SDK');
            } else {
                console.log('⚠️ No valid Gemini API key - using REST fallback');
            }
        } catch (error) {
            console.error('Failed to initialize Gemini:', error);
            genAI = null;
            model = null;
        }
    }

    // Show setup hint in chat
    function showGeminiSetupHint() {
        setTimeout(() => {
            const hint = `🤖 Welcome! To use Gemini AI, add your API key:

1. Get free key: aistudio.google.com/app/apikey
2. Open browser console (F12)
3. Run: localStorage.setItem('gemini_api_key', 'YOUR_KEY')
4. Refresh page

Or I can still help using fallback mode! 🚀`;
            console.log(hint);
        }, 2000);
    }

    // Expose function to set API key
    window.setGeminiAPIKey = function(key) {
        if (key && key.length > 10) {
            localStorage.setItem('gemini_api_key', key);
            GEMINI_CONFIG.apiKey = key;
            initGemini();
            return '✅ API key set! Refresh to use Gemini SDK.';
        }
        return '❌ Invalid API key';
    };

    // Get response using Gemini SDK
    async function getGeminiResponse(message, systemPrompt) {
        if (!model) {
            throw new Error('Gemini not initialized');
        }

        try {
            console.log('🤖 Sending to Gemini:', message);
            
            // Create chat session with system instruction
            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Understood. I will follow these instructions and answer your questions directly.' }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
                    temperature: GEMINI_CONFIG.temperature
                }
            });

            // Send message and get response with timeout
            const result = await Promise.race([
                chat.sendMessage(message),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout')), CONFIG.apiTimeout)
                )
            ]);

            // Extract response properly
            const response = result.response;
            
            if (!response) {
                throw new Error('No response received');
            }
            
            // Use the text() method to get the response text
            const text = response.text();
            
            console.log('✅ Gemini response:', text);
            
            if (!text || text.trim().length < 2) {
                throw new Error('Empty response from API');
            }

            return cleanResponse(text);
        } catch (error) {
            console.error('❌ Gemini API error:', error);
            throw error;
        }
    }

    // Create Chatbot UI
    function createChatbotUI() {
        // Remove existing if any
        const existing = document.getElementById('ai-chatbot-container');
        if (existing) existing.remove();

        chatContainer = document.createElement('div');
        chatContainer.id = 'ai-chatbot-container';
        chatContainer.innerHTML = `
            <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open Chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
            <div id="chatbot-panel" class="chatbot-panel">
                <div class="chatbot-header">
                    <span class="chatbot-title">🎓 AI Tutor</span>
                    <button id="chatbot-close" class="chatbot-close">&times;</button>
                </div>
                <div id="chatbot-messages" class="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Ask me anything..." maxlength="200">
                    <button id="chatbot-send" class="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);
        addStyles();
        
        // Add welcome message
        setTimeout(() => {
            addMessage('ai', getWelcomeMessage());
        }, 100);
    }

    // Welcome message
    function getWelcomeMessage() {
        const hour = new Date().getHours();
        let greeting = 'Hello';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        return `${greeting}! 🌟 I'm your AI learning buddy!

I can help you with:
📚 Explaining topics step-by-step
🎯 Quiz and battle mode tips
📊 Tracking your progress
💡 Study strategies

What would you like to learn today?`;
    }

    // Add CSS Styles
    function addStyles() {
        if (document.getElementById('chatbot-fixed-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'chatbot-fixed-styles';
        style.textContent = `
            #ai-chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
                transition: transform 0.3s ease;
            }

            .chatbot-toggle:hover { transform: scale(1.1); }
            .chatbot-toggle svg { width: 28px; height: 28px; color: #0a0a0f; }

            .chatbot-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
                border: 2px solid #00d4ff;
                border-radius: 16px;
                display: none;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }

            .chatbot-panel.open { display: flex; }

            .chatbot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: rgba(0, 212, 255, 0.1);
                border-bottom: 1px solid rgba(0, 212, 255, 0.3);
            }

            .chatbot-title {
                font-weight: 600;
                color: #00d4ff;
                font-size: 16px;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbot-close:hover { color: #fff; }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .chat-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.5;
                white-space: pre-wrap;
            }

            .chat-message.user {
                align-self: flex-end;
                background: #00d4ff;
                color: #0a0a0f;
                border-bottom-right-radius: 4px;
            }

            .chat-message.ai {
                align-self: flex-start;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-bottom-left-radius: 4px;
            }

            .chat-message.error {
                background: rgba(255, 68, 68, 0.1);
                border-color: #ff4444;
                color: #ff8888;
            }

            .chatbot-input-area {
                display: flex;
                gap: 10px;
                padding: 16px 20px;
                border-top: 1px solid rgba(0, 212, 255, 0.2);
                background: rgba(0, 0, 0, 0.3);
            }

            #chatbot-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 20px;
                padding: 10px 16px;
                color: #fff;
                font-size: 14px;
                outline: none;
            }

            #chatbot-input:focus { border-color: #00d4ff; }
            #chatbot-input::placeholder { color: #666; }
            #chatbot-input.error { border-color: #ff4444; }

            .chatbot-send {
                padding: 10px 20px;
                background: #00d4ff;
                border: none;
                border-radius: 20px;
                color: #0a0a0f;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .chatbot-send:hover { background: #33ddff; }
            .chatbot-send:disabled { opacity: 0.5; cursor: not-allowed; }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #00d4ff;
                border-radius: 50%;
                animation: typingBounce 1.4s ease-in-out infinite;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
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

    // Bind Events
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

        send.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Handle Send Message
    async function handleSend() {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        const text = input.value.trim();

        // Input validation
        if (!text) {
            showInputError('Please type something first!');
            return;
        }

        if (text.length < 2) {
            showInputError('Message too short');
            return;
        }

        // Prevent multiple simultaneous requests
        if (isTyping) {
            showInputError('Please wait for response...');
            return;
        }

        // Set processing state
        isTyping = true;
        input.disabled = true;
        sendBtn.disabled = true;
        
        // Clear input and show user message
        input.value = '';
        addMessage('user', text);
        addToHistory('user', text);

        // Show typing indicator
        showTyping();

        try {
            console.log('📤 Processing message:', text);
            const response = await getAIResponse(text);
            hideTyping();
            
            if (response && response.trim().length > 2) {
                addMessage('ai', response);
                addToHistory('ai', response);
            } else {
                throw new Error('Empty or invalid response');
            }
        } catch (error) {
            hideTyping();
            console.error('Chatbot error:', error);
            
            // Use smart fallback
            const fallback = getSmartResponse(text);
            addMessage('ai', fallback);
            addToHistory('ai', fallback);
        } finally {
            // Reset state
            isTyping = false;
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    // Show input error
    function showInputError(msg) {
        const input = document.getElementById('chatbot-input');
        input.classList.add('error');
        input.placeholder = msg;
        
        setTimeout(() => {
            input.classList.remove('error');
            input.placeholder = 'Ask me anything...';
        }, 2000);
    }

    // Add message to UI
    function addMessage(type, text) {
        const container = document.getElementById('chatbot-messages');
        const msg = document.createElement('div');
        msg.className = `chat-message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;

        // Limit messages
        while (container.children.length > CONFIG.maxMessages) {
            container.removeChild(container.firstChild);
        }
    }

    // Show typing indicator
    function showTyping() {
        const container = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'chat-message ai typing-indicator';
        typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    // Hide typing indicator
    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Get AI Response
    async function getAIResponse(message) {
        // STEP 0: Check intent-based responses first (instant reply)
        if (typeof window.IntentChatbot !== 'undefined') {
            const intentResponse = window.IntentChatbot.getIntentBasedResponse(message);
            if (intentResponse) {
                console.log('⚡ Intent-based response (instant)');
                return intentResponse;
            }
        }

        const history = getRecentHistory();
        
        // Detect question mode
        const mode = detectQuestionMode(message);
        
        // Academic AI Tutor System Prompts
        const modePrompts = {
            MATH: `You are an Expert Academic AI Tutor specializing in Mathematics.

ACADEMIC LEVELS YOU SUPPORT:
- SSC (School level)
- HSC (Higher Secondary)
- Engineering (all branches basics)
- BSc (Science subjects)
- Competitive exams

SUBJECTS: Maths, Physics, Chemistry, Computer Science, Biology, English, Aptitude

MATH MODE RULES:
1. ALWAYS solve step-by-step
2. Show the final answer clearly at the end
3. Use proper mathematical notation
4. Keep explanations simple but accurate
5. NEVER skip steps or give random answers
6. If unsure, say "Let me clarify" and ask

STRUCTURE:
Step 1: Identify what is given and what to find
Step 2: Show working/calculation
Step 3: State final answer clearly

AFTER ANSWERING:
Give 1-2 practice questions related to this topic.

EXAMPLE:
User: "Solve 2x + 5 = 15"
You: "Step 1: Subtract 5 from both sides
2x = 15 - 5
2x = 10

Step 2: Divide both sides by 2
x = 10/2
x = 5 ✅

👉 Practice:
1. Solve: 3x + 4 = 16
2. Solve: x/2 - 3 = 7"`,

            CODING: `You are an Expert Academic AI Tutor specializing in Computer Science.

ACADEMIC LEVELS YOU SUPPORT:
- SSC (School level)
- HSC (Higher Secondary)
- Engineering (all branches basics)
- BSc (Science subjects)
- Competitive exams

CODING MODE RULES:
1. Provide clean, working code first
2. Use proper formatting and comments
3. Explain the logic briefly
4. Show example input/output
5. Keep it beginner-friendly
6. NEVER give wrong or broken code

STRUCTURE:
- Code with comments
- Brief explanation
- Example usage

AFTER ANSWERING:
Give 1-2 practice problems to try.

EXAMPLE:
User: "Write a function to check if number is even"
You: "\`\`\`python
def is_even(n):
    '''Returns True if n is even, False otherwise'''
    return n % 2 == 0

# Example usage:
print(is_even(4))  # True
print(is_even(7))  # False
\`\`\`

The % operator gives remainder. If remainder is 0 when divided by 2, it's even.

👉 Practice:
1. Write a function to check if a number is prime
2. Write a function to calculate factorial"`,

            THEORY: `You are an Expert Academic AI Tutor specializing in Science and Theory.

ACADEMIC LEVELS YOU SUPPORT:
- SSC (School level)
- HSC (Higher Secondary)
- Engineering (all branches basics)
- BSc (Science subjects)
- Competitive exams

SUBJECTS: Physics, Chemistry, Biology, Computer Science concepts

THEORY MODE RULES:
1. Explain in simple, clear language
2. Use relatable examples
3. Break down complex concepts
4. Connect to real-world applications
5. NEVER give wrong information
6. If unsure, ask to clarify

STRUCTURE:
- Definition/Concept
- Simple explanation
- Real-world example
- Key points to remember

AFTER ANSWERING:
Give 1-2 questions to test understanding.

EXAMPLE:
User: "What is Newton's First Law?"
You: "Newton's First Law (Law of Inertia):

An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.

🌍 Real Example:
When a moving bus suddenly stops, passengers fall forward. Their bodies want to keep moving!

🔑 Key Point:
Objects resist changes to their motion.

👉 Practice:
1. Why do we wear seatbelts in cars?
2. What happens to a ball rolling on a frictionless surface?"`,

            GENERAL: `You are an Expert Academic AI Tutor.

ACADEMIC LEVELS YOU SUPPORT:
- SSC (School level)
- HSC (Higher Secondary)
- Engineering (all branches basics)
- BSc (Science subjects)
- Competitive exams

SUBJECTS: Maths, Physics, Chemistry, Computer Science, Biology, English, Aptitude

GENERAL MODE RULES:
1. Be friendly and professional
2. Answer directly and clearly
3. Guide students toward learning
4. Ask clarifying questions if needed
5. Keep tone encouraging

TONE: Like a knowledgeable, patient teacher.

EXAMPLE:
User: "I'm bored"
You: "Let's make learning fun! 🎓 What subject interests you - Math, Physics, Coding, or something else? I can help with homework, explain concepts, or give you practice problems!"

User: "Help"
You: "I'm here to help! 📚 What do you need?
- Homework problem?
- Concept explanation?
- Practice questions?
- Coding help?

Just tell me your question!"`
        };
        
        const systemPrompt = modePrompts[mode] || modePrompts.GENERAL;

        // PRIMARY: Try Gemini SDK (Google AI Studio)
        if (model) {
            try {
                console.log(`🤖 Using Gemini SDK (${mode} mode)`);
                const response = await getGeminiResponse(message, systemPrompt);
                return response;
            } catch (geminiError) {
                console.log('Gemini SDK failed:', geminiError.message);
            }
        }

        // FALLBACK 1: Try Gemini REST API
        try {
            console.log('🔄 Trying Gemini REST API...');
            const apiKey = GEMINI_CONFIG.apiKey || 'AIzaSyDemoKeyForTestingOnly';
            const response = await fetchWithTimeout(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: systemPrompt }] },
                            { role: 'model', parts: [{ text: 'I understand! I am NeuroQuest AI Tutor, ready to help students learn!' }] },
                            ...history,
                            { role: 'user', parts: [{ text: message }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 200,
                            topP: 0.9
                        }
                    })
                },
                CONFIG.apiTimeout
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text && text.trim().length > 5) {
                return cleanResponse(text);
            }
            throw new Error('Empty response');
            
        } catch (error) {
            console.log('Gemini REST failed, trying fallback:', error.message);
            
            // FALLBACK 2: Try Groq as backup
            try {
                console.log('🔄 Trying Groq API...');
                const response = await fetchWithTimeout(
                    'https://api.groq.com/openai/v1/chat/completions',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer gsk_demo_key'
                        },
                        body: JSON.stringify({
                            model: 'llama-3.1-8b-instant',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })),
                                { role: 'user', content: message }
                            ],
                            max_tokens: 200,
                            temperature: 0.7
                        })
                    },
                    CONFIG.apiTimeout
                );

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                const text = data.choices?.[0]?.message?.content;
                
                if (text && text.trim().length > 5) {
                    return cleanResponse(text);
                }
                throw new Error('Empty response');
                
            } catch (backupError) {
                console.log('Groq also failed:', backupError.message);
                throw backupError;
            }
        }
    }

    // Fetch with timeout
    function fetchWithTimeout(url, options, timeout) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    // Clean response
    function cleanResponse(text) {
        // Remove common prefixes
        text = text.replace(/^(AI|Assistant|Bot):\s*/i, '');
        text = text.replace(/^"+|"+$/g, '');
        
        // Trim and limit
        text = text.trim();
        if (text.length > 400) {
            text = text.substring(0, 397) + '...';
        }
        
        // Ensure punctuation
        if (!text.match(/[.!?]$/)) {
            text += '.';
        }
        
        return text;
    }

    // Detect question type and return appropriate mode
    function detectQuestionMode(message) {
        const lower = message.toLowerCase().trim();
        
        // MATH MODE detection
        const mathPatterns = [
            /^\d+\s*[+\-*/^]\s*\d+$/,                    // 2+2, 5-3, 4*5
            /^what is\s+\d+\s*[+\-*/]\s*\d+/,           // what is 2+2
            /^calculate\s+[\d\s+\-*/]+/,                 // calculate 5*3+2
            /^solve\s+[\d\s+\-*/=]+/,                    // solve 10/2
            /^(find|compute|evaluate)\s+\d/,            // find 5+3
            /\d+\s*\+\s*\d+|\d+\s*-\s*\d+|\d+\s*\*\s*\d+|\d+\s*\/\s*\d+/,
            /square root|sqrt|√\d+|\d+\^\d+|\d+ squared/,
            /area of|perimeter of|volume of|solve for x|equation/
        ];
        
        if (mathPatterns.some(p => p.test(lower))) return 'MATH';
        
        // CODING MODE detection
        const codingPatterns = [
            /^(write|create|make|build)\s+(a|an|the)?\s*(code|program|function|script)/,
            /^(fix|debug|correct)\s+(this|my|the)?\s*(code|error|bug)/,
            /^(how to|how do i)\s+(write|create|make|implement)/,
            /\b(code|function|class|variable|loop|array|bug|error|syntax)\b.*\b(in|using|with)\b/,
            /^(python|javascript|java|c\+\+|html|css|sql)\s+(code|help|question)/,
            /```|<code>|<script>|\bdef\s+\w+\(|\bfunction\s+\w+\(/,
            /compile error|runtime error|exception|stack trace/
        ];
        
        if (codingPatterns.some(p => p.test(lower))) return 'CODING';
        
        // THEORY MODE detection
        const theoryPatterns = [
            /^(what is|what are|define|explain|describe|tell me about)\s+\w+/,
            /^(how does|how do|why is|why does)\s+\w+/,
            /^(difference between|compare|contrast)\s+\w+/,
            /^(concept|theory|principle|fundamentals?)\s+of/,
            /\b(meaning|definition|concept|theory|explain)\b/
        ];
        
        if (theoryPatterns.some(p => p.test(lower))) return 'THEORY';
        
        // Default to GENERAL
        return 'GENERAL';
    }
    
    // Calculate simple math expressions
    function calculateMath(expression) {
        try {
            // Extract numbers and operator
            const clean = expression.replace(/[^\d+\-*/.]/g, '');
            const match = clean.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/);
            
            if (!match) return null;
            
            const [, a, op, b] = match;
            const num1 = parseFloat(a);
            const num2 = parseFloat(b);
            
            switch(op) {
                case '+': return num1 + num2;
                case '-': return num1 - num2;
                case '*': return num1 * num2;
                case '/': return num2 !== 0 ? num1 / num2 : 'undefined';
                default: return null;
            }
        } catch (e) {
            return null;
        }
    }

    // Smart fallback responses
    function getSmartResponse(message) {
        const lower = message.toLowerCase().trim();
        const mode = detectQuestionMode(message);
        
        // Check demo responses first
        if (DEMO_RESPONSES[lower]) {
            return DEMO_RESPONSES[lower];
        }
        
        // Handle based on detected mode
        if (mode === 'MATH') {
            const result = calculateMath(message);
            if (result !== null) {
                return `${result} 🎯`;
            }
        }
        
        // Direct factual answers
        if (lower.includes('capital of france') || lower.includes('capital of paris')) {
            return 'Paris 🇫🇷';
        }
        
        if (lower.includes('capital of india')) {
            return 'New Delhi 🇮🇳';
        }
        
        if (lower.includes('capital of usa') || lower.includes('capital of america')) {
            return 'Washington, D.C. 🇺🇸';
        }
        
        if (lower.includes('capital of japan')) {
            return 'Tokyo 🇯🇵';
        }
        
        if (lower.includes('capital of uk') || lower.includes('capital of england')) {
            return 'London 🇬🇧';
        }
        
        if (lower.includes('2+2') || lower.includes('2 + 2')) {
            return '4 🎯';
        }
        
        if (lower.includes('5+5') || lower.includes('5 + 5')) {
            return '10 🎯';
        }
        
        if (lower.includes('10*10') || lower.includes('10 * 10') || lower.includes('10x10')) {
            return '100 🎯';
        }
        
        if (lower.includes('square root of 16') || lower.includes('√16')) {
            return '4 🎯';
        }
        
        if (lower.includes('square root of 25') || lower.includes('√25')) {
            return '5 🎯';
        }
        
        if (lower.includes('pi') && (lower.includes('value') || lower.includes('equals'))) {
            return 'π ≈ 3.14159... 🥧';
        }
        
        // Check for question generation request
        if (lower.includes('generate question') || lower.includes('create question') || lower.includes('make question') || lower.match(/questions? about/)) {
            const topic = message.replace(/.*(about|on|for)\s+/i, '').trim();
            if (topic && topic.length > 2) {
                // Generate questions asynchronously
                setTimeout(async () => {
                    const questions = await window.QuestionGeneratorAI.generate(topic);
                    if (questions) {
                        addMessage('ai', questions);
                        addToHistory('ai', questions);
                    }
                }, 500);
                return `Generating questions about "${topic}"... 📝\n\nGive me a moment!`;
            }
        }
        
        // Topic-based responses
        if (lower.includes('array')) {
            return `Arrays are like numbered lists! 📋\n\nExample: [1, 2, 3, 4]\n\nEach item has an index starting from 0. Want to practice with a quick quiz on arrays?`;
        }
        
        if (lower.includes('loop') || lower.includes('for') || lower.includes('while')) {
            return `Loops let you repeat code! 🔄\n\nA for loop runs a set number of times. A while loop runs until a condition is false.\n\nWhich one would you like to explore?`;
        }
        
        if (lower.includes('function')) {
            return `Functions are reusable blocks of code! 📦\n\nThey take input, do work, and return output. Like a mini-program!\n\nWant to see an example in action?`;
        }
        
        if (lower.includes('variable')) {
            return `Variables store data! 📦\n\nThink of them as labeled boxes: let age = 20;\n\nThe box is named 'age' and contains 20. Simple, right?\n\nReady to try using variables?`;
        }
        
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return `Hey there! 🌟 Ready to learn something awesome today?\n\nI can help with programming, math, science, or we can jump straight into a quiz! What sounds good?`;
        }
        
        if (lower.includes('help')) {
            return `I'm here to help! 💪\n\nI can:\n• Explain topics step-by-step\n• Help with coding problems\n• Suggest quizzes and battles\n• Track your learning progress\n\nWhat do you need help with?`;
        }
        
        if (lower.includes('quiz') || lower.includes('test')) {
            return `Quizzes are the best way to learn! 🎯\n\nChoose your style:\n• Story Mode - Learn as you play\n• Battle Mode - Race against AI\n• Practice Mode - No pressure\n\nWhich mode sounds fun?`;
        }
        
        if (lower.includes('battle')) {
            return `Battle Mode is intense! ⚔️\n\nYou'll race an AI opponent to answer questions. Speed + accuracy = victory!\n\nWant to warm up with practice first, or dive straight into battle?`;
        }
        
        if (lower.includes('profile') || lower.includes('xp') || lower.includes('level')) {
            return `Your profile shows your journey! 📊\n\nCheck your:\n• Level and XP\n• Daily streak\n• Achievements\n• Progress in each subject\n\nKeeping your streak alive earns bonus XP! How's your streak looking?`;
        }
        
        if (lower.includes('tired') || lower.includes('bored') || lower.includes('hard')) {
            return `I hear you! 💙 Learning can be tough sometimes.\n\nHere's what helps:\n• Take a 5-minute break\n• Switch to a different topic\n• Try Practice Mode (no pressure)\n• Celebrate small wins!\n\nWhat would make this easier for you?`;
        }
        
        // Default contextual responses
        const defaults = [
            `Great question! 🤔\n\nLet me think... Actually, trying it out is the best way to learn!\n\nWant to test your knowledge with a quick quiz on this topic?`,
            `Interesting! 💡\n\nThe best way to understand this is through practice.\n\nShould we find a quiz on this topic, or would you like me to break it down step by step?`,
            `I like your curiosity! 🌟\n\nThis is a great topic to explore.\n\nWould you prefer to learn through a story mode lesson, or jump straight into practice questions?`,
            `Good one! 🎯\n\nLearning by doing beats just reading.\n\nWant to try a battle mode challenge on this? It's more fun than it sounds!`
        ];
        
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    // Get recent history for context
    function getRecentHistory() {
        return messageHistory.slice(-CONFIG.historyLimit).map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            content: m.content
        }));
    }

    // Add to history
    function addToHistory(role, content) {
        messageHistory.push({ role, content, time: Date.now() });
        
        // Trim history
        if (messageHistory.length > 20) {
            messageHistory = messageHistory.slice(-20);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('neuroquest_chat_history', JSON.stringify(messageHistory));
        } catch (e) {}
    }

    // Load history
    function loadHistory() {
        try {
            const saved = localStorage.getItem('neuroquest_chat_history');
            if (saved) {
                messageHistory = JSON.parse(saved);
            }
        } catch (e) {
            messageHistory = [];
        }
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();