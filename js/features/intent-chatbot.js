/**
 * Intent-Based Conversational System
 * Provides instant responses to common greetings, small talk, and simple commands
 * Modular design - can be integrated with any existing chatbot
 */

(function() {
    'use strict';

    // ==========================================
    // INTENT DATABASE
    // ==========================================
    const intents = [
        {
            name: 'greeting',
            keywords: ['hi', 'hello', 'hey', 'greetings', 'howdy', 'sup', 'what\'s up'],
            responses: [
                "Hello! 👋 How can I help you today?",
                "Hey there! 😊 What can I do for you?",
                "Hi! Ready to assist you! 🚀",
                "Hello! What's on your mind today? 💭"
            ]
        },
        {
            name: 'how_are_you',
            keywords: ['how are you', 'how r u', 'how do you do', 'how\'s it going', 'how are things'],
            responses: [
                "I'm doing great! Thanks for asking! 😊 How can I help you?",
                "I'm awesome! Ready to assist you! 🌟",
                "Feeling helpful today! 💪 What do you need?",
                "I'm good! How about you? 😄"
            ]
        },
        {
            name: 'goodbye',
            keywords: ['bye', 'goodbye', 'see you', 'cya', 'later', 'farewell', 'good night'],
            responses: [
                "Goodbye! Have a wonderful day! 👋",
                "See you later! 😊 Take care!",
                "Bye! Come back anytime! 🌟",
                "Goodbye! Stay curious! 🚀"
            ]
        },
        {
            name: 'thanks',
            keywords: ['thanks', 'thank you', 'thx', 'appreciate', 'grateful', 'ty'],
            responses: [
                "You're welcome! 😊",
                "Happy to help! 🌟",
                "Anytime! That's what I'm here for! 💪",
                "My pleasure! 🎉"
            ]
        },
        {
            name: 'help',
            keywords: ['help', 'assist', 'support', 'what can you do', 'capabilities', 'features'],
            responses: [
                "I can help with:\n• Answering questions 💬\n• Explaining topics 📚\n• Providing guidance 💡\n• And much more!\n\nWhat do you need help with?",
                "I'm here to assist! Just ask me anything and I'll do my best to help! 🎯",
                "Need help? I've got you covered! 💪 Just tell me what you need!"
            ]
        },
        {
            name: 'joke',
            keywords: ['joke', 'funny', 'laugh', 'humor', 'make me laugh'],
            responses: [
                "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
                "Why did the student eat his homework? Because the teacher told him it was a piece of cake! 🍰",
                "What do you call a fake noodle? An impasta! 🍝",
                "Why don't scientists trust atoms? Because they make up everything! ⚛️"
            ]
        },
        {
            name: 'name',
            keywords: ['your name', 'who are you', 'what are you', 'what should i call you'],
            responses: [
                "I'm your AI assistant! You can call me whatever you like! 🤖",
                "I'm an intelligent chatbot here to help you! 🌟",
                "Just call me your helpful AI buddy! 😊"
            ]
        },
        {
            name: 'agreement',
            keywords: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'alright', 'sounds good'],
            responses: [
                "Great! 👍 How can I help you further?",
                "Awesome! What's next? 🎯",
                "Perfect! Let me know what you need! 😊"
            ]
        },
        {
            name: 'disagreement',
            keywords: ['no', 'nope', 'nah', 'not really', 'never mind', 'forget it'],
            responses: [
                "No problem! I'm here if you need anything! 😊",
                "That's okay! Let me know if you change your mind! 👍",
                "Alright! Feel free to ask anytime! 🌟"
            ]
        },
        {
            name: 'greeting_time',
            keywords: ['good morning', 'good afternoon', 'good evening'],
            responses: [
                "Good morning! ☀️ Hope you have a great day ahead!",
                "Good afternoon! 🌤️ How's your day going?",
                "Good evening! 🌙 Ready to help you unwind and learn!"
            ]
        },
        {
            name: 'praise',
            keywords: ['good job', 'well done', 'awesome', 'amazing', 'great work', 'impressive'],
            responses: [
                "Thank you! I appreciate the kind words! 😊",
                "Glad I could help! 🌟",
                "Thanks! That means a lot! 💙"
            ]
        },
        {
            name: 'confusion',
            keywords: ['i don\'t understand', 'confused', 'not clear', 'explain again', 'what do you mean'],
            responses: [
                "No worries! Let me try to explain differently. What specific part is confusing? 🤔",
                "I understand! Let me break it down more simply. What would you like me to clarify? 💡",
                "That's okay! Ask me anything specific and I'll help! 😊"
            ]
        }
    ];

    // ==========================================
    // INTENT MATCHING ENGINE
    // ==========================================
    
    /**
     * Match user message to an intent
     * @param {string} message - User's message
     * @returns {object|null} - Matched intent or null
     */
    function matchIntent(message) {
        if (!message || typeof message !== 'string') {
            return null;
        }

        const normalizedMessage = message.toLowerCase().trim();
        
        // Remove punctuation for better matching
        const cleanMessage = normalizedMessage.replace(/[^\w\s']/g, ' ').replace(/\s+/g, ' ').trim();

        // Check each intent
        for (const intent of intents) {
            for (const keyword of intent.keywords) {
                const cleanKeyword = keyword.toLowerCase();
                
                // Exact match or includes match
                if (cleanMessage === cleanKeyword || cleanMessage.includes(cleanKeyword)) {
                    console.log(`🎯 Intent matched: ${intent.name}`);
                    return intent;
                }
            }
        }

        return null;
    }

    /**
     * Get response for matched intent
     * @param {object} intent - Matched intent object
     * @returns {string} - Random response from intent
     */
    function getIntentResponse(intent) {
        if (!intent || !intent.responses || intent.responses.length === 0) {
            return null;
        }

        // Random response for variety
        const randomIndex = Math.floor(Math.random() * intent.responses.length);
        return intent.responses[randomIndex];
    }

    /**
     * Main handler - checks if message matches any intent
     * @param {string} message - User's message
     * @returns {string|null} - Intent response or null if no match
     */
    function getIntentBasedResponse(message) {
        const matchedIntent = matchIntent(message);
        
        if (matchedIntent) {
            return getIntentResponse(matchedIntent);
        }

        return null;
    }

    // ==========================================
    // PUBLIC API
    // ==========================================
    
    // Expose to global scope for integration
    window.IntentChatbot = {
        getIntentResponse,
        matchIntent,
        getIntentBasedResponse,
        intents,
        
        // Add custom intent dynamically
        addIntent(intent) {
            if (intent.name && intent.keywords && intent.responses) {
                intents.push(intent);
                console.log(`✅ Custom intent added: ${intent.name}`);
                return true;
            }
            console.error('❌ Invalid intent format');
            return false;
        },
        
        // Get intent statistics
        getStats() {
            return {
                totalIntents: intents.length,
                intentNames: intents.map(i => i.name),
                totalResponses: intents.reduce((sum, i) => sum + i.responses.length, 0)
            };
        }
    };

    console.log('✅ Intent-Based Conversational System initialized');
    console.log(`📊 Loaded ${intents.length} intents with ${intents.reduce((sum, i) => sum + i.responses.length, 0)} responses`);

})();
