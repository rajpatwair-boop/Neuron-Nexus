/**
 * AI Chatbot Pro - Production-Ready Intelligent Assistant
 * Features: Multi-model AI, Voice, Persistent Storage, File Analysis, Premium UX
 * Version: 2.0.0
 */

(function() {
    'use strict';

    // ==========================================
    // OFFLINE ACADEMIC KNOWLEDGE BASE
    // ==========================================
    const academicKnowledgeBase = {
        math: {
            // Basic Arithmetic
            'what is addition': 'Addition (+) combines numbers. Example: 2 + 3 = 5',
            'what is subtraction': 'Subtraction (-) takes away. Example: 5 - 2 = 3',
            'what is multiplication': 'Multiplication (×) is repeated addition. Example: 3 × 4 = 12',
            'what is division': 'Division (÷) shares equally. Example: 12 ÷ 3 = 4',
            'what is fraction': 'A fraction represents parts of a whole. Example: ½ means 1 part of 2 equal parts',
            'what is decimal': 'Decimals show parts using a point. Example: 0.5 = ½',
            'what is percentage': 'Percentage (%) means per 100. Example: 50% = 50/100 = ½',
            // Tables
            'table of 2': '2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10, 2×6=12, 2×7=14, 2×8=16, 2×9=18, 2×10=20',
            'table of 3': '3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15, 3×6=18, 3×7=21, 3×8=24, 3×9=27, 3×10=30',
            'table of 5': '5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25, 5×6=30, 5×7=35, 5×8=40, 5×9=45, 5×10=50',
            'table of 10': '10×1=10, 10×2=20, 10×3=30, 10×4=40, 10×5=50, 10×6=60, 10×7=70, 10×8=80, 10×9=90, 10×10=100',
            // Geometry
            'what is circle': 'A circle is a round shape where all points are equidistant from the center',
            'what is square': 'A square has 4 equal sides and 4 right angles (90°)',
            'what is triangle': 'A triangle has 3 sides and 3 angles. Sum of angles = 180°',
            'what is rectangle': 'A rectangle has 4 sides with opposite sides equal and 4 right angles',
            'what is perimeter': 'Perimeter is the total distance around a shape',
            'what is area': 'Area is the space inside a shape. Rectangle: length × width',
            // Algebra
            'what is algebra': 'Algebra uses letters (like x) to represent unknown numbers',
            'what is equation': 'An equation has an equals sign (=) showing two things are equal. Example: 2x = 10',
            'what is variable': 'A variable is a letter that represents an unknown number. Example: x, y, z',
            // Advanced
            'what is pythagoras theorem': 'In a right triangle: a² + b² = c² (where c is the hypotenuse)',
            'what is square root': 'Square root of a number is a value that, when multiplied by itself, gives the original. √16 = 4',
            'what is pi': 'Pi (π) ≈ 3.14159... It is the ratio of circle\'s circumference to its diameter'
        },
        
        science: {
            // Biology
            'what is photosynthesis': 'Photosynthesis is how plants make food using sunlight, water, and CO₂. Formula: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂',
            'what is cell': 'A cell is the basic unit of life. All living things are made of cells',
            'what is human body': 'The human body has 11 organ systems including digestive, respiratory, circulatory, and nervous systems',
            'what is digestive system': 'Digestive system breaks down food: Mouth → Esophagus → Stomach → Intestines → Waste removal',
            'what is heart': 'The heart is a muscular organ that pumps blood throughout the body. It beats about 100,000 times per day',
            'what is brain': 'The brain controls all body functions. It has about 86 billion neurons',
            'what is dna': 'DNA (Deoxyribonucleic Acid) contains genetic instructions for all living organisms',
            // Physics
            'what is force': 'Force is a push or pull that can change an object\'s motion. Formula: F = ma',
            'what is gravity': 'Gravity is the force that attracts objects toward each other. Earth\'s gravity pulls us down',
            'what is energy': 'Energy is the ability to do work. Types: Kinetic (moving), Potential (stored)',
            'what is light': 'Light is electromagnetic radiation that enables us to see. It travels at 300,000 km/s',
            'what is sound': 'Sound is a vibration that travels through air (or other medium) as waves',
            'what is electricity': 'Electricity is the flow of electrons through a conductor',
            // Chemistry
            'what is matter': 'Matter is anything that has mass and takes up space. Three states: solid, liquid, gas',
            'what is atom': 'An atom is the smallest unit of matter. Contains protons, neutrons, and electrons',
            'what is element': 'An element is a pure substance made of one type of atom. Examples: Oxygen, Gold, Carbon',
            'what is compound': 'A compound is made of two or more elements chemically bonded. Example: H₂O (water)',
            'what is acid': 'Acids have pH < 7, taste sour, turn blue litmus red. Example: Lemon juice, Vinegar',
            'what is base': 'Bases have pH > 7, taste bitter, turn red litmus blue. Example: Soap, Baking soda',
            // Earth Science
            'what is solar system': 'The Solar System has the Sun and 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
            'what is earth': 'Earth is the third planet from the Sun. It is the only known planet with life',
            'what is moon': 'The Moon is Earth\'s natural satellite. It affects tides and takes 27.3 days to orbit Earth',
            'what is sun': 'The Sun is a star at the center of our Solar System. It provides light and heat to Earth'
        },
        
        english: {
            // Grammar
            'what is noun': 'A noun is a naming word. It names a person, place, thing, or idea. Examples: Ram, Delhi, book, happiness',
            'what is verb': 'A verb is an action word. It shows what someone or something does. Examples: run, eat, think, is',
            'what is adjective': 'An adjective describes a noun. Examples: big, red, happy, beautiful',
            'what is adverb': 'An adverb describes a verb, adjective, or other adverb. Examples: quickly, very, well',
            'what is pronoun': 'A pronoun replaces a noun. Examples: he, she, it, they, we, you, I',
            'what is preposition': 'A preposition shows position or relationship. Examples: in, on, at, under, between, behind',
            'what is conjunction': 'A conjunction joins words or sentences. Examples: and, but, or, because, so',
            'what is article': 'Articles are a, an, the. Use "a/an" for general, "the" for specific',
            // Tenses
            'what is tense': 'Tense shows when an action happens: Past (happened), Present (happening), Future (will happen)',
            'what is past tense': 'Past tense describes completed actions. Example: I walked, She ate',
            'what is present tense': 'Present tense describes current actions. Example: I walk, She eats',
            'what is future tense': 'Future tense describes actions that will happen. Example: I will walk, She will eat',
            // Sentence Structure
            'what is sentence': 'A sentence is a group of words that expresses a complete thought. It starts with a capital letter and ends with punctuation',
            'what is subject': 'The subject is who or what the sentence is about. Example: Ram (subject) is playing',
            'what is predicate': 'The predicate tells what the subject does. Example: Ram is playing (predicate)',
            // Figures of Speech
            'what is simile': 'A simile compares using "like" or "as". Example: "as brave as a lion"',
            'what is metaphor': 'A metaphor makes a direct comparison. Example: "He is a lion" (meaning brave)',
            'what is personification': 'Personification gives human qualities to non-human things. Example: "The wind whispered"'
        },
        
        gk: {
            // Countries & Capitals
            'capital of india': 'New Delhi 🇮🇳',
            'capital of usa': 'Washington D.C. 🇺🇸',
            'capital of uk': 'London 🇬🇧',
            'capital of japan': 'Tokyo 🇯🇵',
            'capital of china': 'Beijing 🇨🇳',
            'capital of france': 'Paris 🇫🇷',
            'capital of germany': 'Berlin 🇩🇪',
            'capital of russia': 'Moscow 🇷🇺',
            'capital of australia': 'Canberra 🇦🇺',
            'capital of canada': 'Ottawa 🇨🇦',
            // India
            'national animal of india': 'Royal Bengal Tiger 🐅',
            'national bird of india': 'Indian Peacock 🦚',
            'national flower of india': 'Lotus 🪷',
            'national tree of india': 'Banyan Tree 🌳',
            'national fruit of india': 'Mango 🥭',
            'national anthem of india': 'Jana Gana Mana by Rabindranath Tagore',
            'national song of india': 'Vande Mataram by Bankim Chandra Chattopadhyay',
            'independence day of india': '15th August 1947',
            'republic day of india': '26th January 1950',
            'who is father of nation': 'Mahatma Gandhi',
            // Famous People
            'who invented telephone': 'Alexander Graham Bell in 1876 📞',
            'who invented light bulb': 'Thomas Edison 💡',
            'who invented airplane': 'Wright Brothers ✈️',
            'who invented computer': 'Charles Babbage (Father of Computer) 💻',
            'who discovered gravity': 'Isaac Newton 🍎',
            'who wrote ramayana': 'Sage Valmiki',
            'who wrote mahabharata': 'Sage Vyasa',
            'who is missile man': 'Dr. APJ Abdul Kalam 🚀',
            // Geography
            'largest continent': 'Asia',
            'smallest continent': 'Australia',
            'largest ocean': 'Pacific Ocean',
            'highest mountain': 'Mount Everest (8,848 meters) 🏔️',
            'longest river': 'Nile River (6,650 km) 🌊',
            'largest desert': 'Sahara Desert 🏜️',
            'largest country': 'Russia',
            'smallest country': 'Vatican City',
            // Space
            'how many planets': '8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
            'largest planet': 'Jupiter',
            'smallest planet': 'Mercury',
            'red planet': 'Mars (appears red due to iron oxide)',
            'hottest planet': 'Venus',
            'ring planet': 'Saturn (has beautiful rings)',
            'galaxy name': 'Milky Way 🌌',
            'first man on moon': 'Neil Armstrong (1969) 🌙'
        }
    };

    // ==========================================
    // OFFLINE KNOWLEDGE SYSTEM
    // ==========================================
    const OfflineKnowledgeSystem = {
        // Normalize question for matching
        normalize(question) {
            return question.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        },

        // Find answer in knowledge base
        findAnswer(question) {
            const normalized = this.normalize(question);
            
            // Direct match
            for (const subject in academicKnowledgeBase) {
                for (const key in academicKnowledgeBase[subject]) {
                    if (normalized === key) {
                        return {
                            answer: academicKnowledgeBase[subject][key],
                            source: 'offline',
                            subject: subject,
                            confidence: 'high'
                        };
                    }
                }
            }

            // Partial match (keyword inclusion)
            for (const subject in academicKnowledgeBase) {
                for (const key in academicKnowledgeBase[subject]) {
                    // Check if question contains key terms
                    const keyWords = key.split(' ');
                    const matchCount = keyWords.filter(word => 
                        normalized.includes(word) && word.length > 2
                    ).length;
                    
                    if (matchCount >= 2 || (matchCount === keyWords.length)) {
                        return {
                            answer: academicKnowledgeBase[subject][key],
                            source: 'offline',
                            subject: subject,
                            confidence: 'medium'
                        };
                    }
                }
            }

            return null;
        },

        // Basic math solver
        solveMath(question) {
            try {
                // Extract math expression
                let expr = question.toLowerCase()
                    .replace(/what is|calculate|solve|equals?/g, '')
                    .replace(/plus/g, '+')
                    .replace(/minus/g, '-')
                    .replace(/times?|multiplied by/g, '*')
                    .replace(/divided by|over/g, '/')
                    .replace(/[^\d+\-*/().\s]/g, '')
                    .trim();

                if (!expr || expr.length < 3) return null;

                // Safety check
                if (!/^[\d+\-*/().\s]+$/.test(expr)) return null;

                // Evaluate
                const result = Function('"use strict"; return (' + expr + ')')();
                
                if (isNaN(result) || !isFinite(result)) return null;

                return {
                    answer: `🧮 ${expr} = ${result}`,
                    source: 'math-solver',
                    confidence: 'high'
                };
            } catch (e) {
                return null;
            }
        },

        // Main handler
        async handle(question) {
            console.log('🔍 Checking offline knowledge base...');

            // Try math first
            const mathResult = this.solveMath(question);
            if (mathResult) {
                console.log('✅ Math solution found');
                return mathResult;
            }

            // Try knowledge base
            const knowledgeResult = this.findAnswer(question);
            if (knowledgeResult) {
                console.log('✅ Offline answer found:', knowledgeResult.subject);
                return knowledgeResult;
            }

            console.log('❌ No offline answer found');
            return null;
        },

        // Get stats
        getStats() {
            let totalQuestions = 0;
            const subjects = {};
            
            for (const subject in academicKnowledgeBase) {
                const count = Object.keys(academicKnowledgeBase[subject]).length;
                totalQuestions += count;
                subjects[subject] = count;
            }

            return { totalQuestions, subjects };
        }
    };

    // ==========================================
    // CONFIGURATION
    // ==========================================
    
    // Load API key from localStorage or use default
    const getAPIKey = () => {
        const key = localStorage.getItem('openrouter_api_key');
        if (key && key.length > 20) {
            console.log('✅ OpenRouter API key loaded from localStorage');
            return key;
        }
        console.warn('⚠️ No valid OpenRouter API key found');
        return '';
    };
    
    const CONFIG = {
        // API Configuration
        openRouter: {
            apiKey: getAPIKey(),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            models: {
                primary: 'openai/gpt-3.5-turbo',
                fallback: 'mistralai/mistral-7b-instruct',
                premium: 'anthropic/claude-3-haiku'
            },
            timeout: 30000,
            maxRetries: 2
        },

        // Feature Toggles
        features: {
            voiceInput: true,
            voiceOutput: true,
            fileUpload: true,
            persistentStorage: true,
            themeToggle: true,
            search: true,
            exportPDF: true
        },

        // UI Settings
        ui: {
            maxMessages: 100,
            typingDelay: 300,
            theme: localStorage.getItem('chatbot_theme') || 'dark',
            autoSpeak: localStorage.getItem('chatbot_auto_speak') === 'true'
        },

        // Storage
        storage: {
            dbName: 'neuroquest_chatbot',
            maxHistoryDays: 30,
            syncInterval: 5000
        }
    };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const state = {
        isOpen: false,
        isTyping: false,
        isListening: false,
        isSpeaking: false,
        currentModel: 'primary',
        messages: [],
        sessionId: generateSessionId(),
        userId: localStorage.getItem('neuroquest_user_id') || generateUserId(),
        uploadedFile: null,
        searchQuery: '',
        theme: CONFIG.ui.theme,
        abortController: null
    };

    // ==========================================
    // MULTI-MODEL AI SYSTEM
    // ==========================================
    class MultiModelAI {
        constructor() {
            this.models = CONFIG.openRouter.models;
            this.currentModel = 'primary';
            this.fallbackChain = ['primary', 'fallback', 'premium'];
        }

        async generateResponse(message, systemPrompt, history = []) {
            // STEP 0: Check intent-based responses first (instant reply)
            if (typeof window.IntentChatbot !== 'undefined') {
                const intentResponse = window.IntentChatbot.getIntentBasedResponse(message);
                if (intentResponse) {
                    console.log('⚡ Intent-based response (instant)');
                    return {
                        success: true,
                        response: intentResponse,
                        source: 'intent',
                        confidence: 'high'
                    };
                }
            }

            // STEP 0.5: Check Academic Knowledge Base (offline training)
            if (typeof window.academicBot !== 'undefined') {
                try {
                    const academicResponse = await window.academicBot.getResponse(message);
                    if (academicResponse && !academicResponse.includes("I'm not fully sure")) {
                        console.log('🎓 Academic knowledge base matched');
                        return {
                            success: true,
                            response: academicResponse,
                            source: 'academic-kb',
                            confidence: 'high'
                        };
                    }
                } catch (e) {
                    console.log('Academic bot failed, continuing to API...');
                }
            }

            // STEP 1: Try offline knowledge base first
            console.log('🧠 Hybrid Response: Checking offline knowledge...');
            const offlineResult = await OfflineKnowledgeSystem.handle(message);
            
            if (offlineResult) {
                console.log('✅ Offline answer found, skipping API call');
                return {
                    success: true,
                    response: offlineResult.answer,
                    source: offlineResult.source,
                    subject: offlineResult.subject,
                    confidence: offlineResult.confidence
                };
            }

            // STEP 2: Fallback to AI API
            console.log('🌐 No offline answer, trying AI API...');
            const errors = [];

            for (const modelKey of this.fallbackChain) {
                try {
                    console.log(`🤖 Trying model: ${this.models[modelKey]}`);
                    const response = await this.callModel(
                        this.models[modelKey],
                        message,
                        systemPrompt,
                        history
                    );
                    
                    this.currentModel = modelKey;
                    console.log(`✅ Response from: ${this.models[modelKey]}`);
                    
                    return {
                        success: true,
                        response: response,
                        model: this.models[modelKey],
                        modelKey: modelKey,
                        source: 'ai-api',
                        offline: false
                    };
                } catch (error) {
                    console.warn(`❌ Model ${modelKey} failed:`, error.message);
                    errors.push({ model: modelKey, error: error.message });
                    continue;
                }
            }

            // STEP 3: All failed - return helpful message
            throw new Error(`All models failed: ${JSON.stringify(errors)}`);
        }

        async callModel(modelName, message, systemPrompt, history) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.openRouter.timeout);

            try {
                // DEBUG: Check API key
                const apiKey = CONFIG.openRouter.apiKey;
                console.log('🔑 API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING');
                
                if (!apiKey || apiKey.length < 20) {
                    throw new Error('OpenRouter API key not configured. Set it with: ChatbotPro.setAPIKey("your-key")');
                }

                const messages = [
                    { role: 'system', content: systemPrompt },
                    ...history.map(h => ({ role: h.role, content: h.content })),
                    { role: 'user', content: message }
                ];

                // DEBUG: Log request details
                console.log('📤 Sending request to OpenRouter:', {
                    model: modelName,
                    messageCount: messages.length,
                    endpoint: CONFIG.openRouter.endpoint
                });

                const response = await fetch(CONFIG.openRouter.endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'NeuroQuest AI Chatbot'
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // DEBUG: Log response status
                console.log('📥 Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ API Error:', errorData);
                    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;

                if (!content) {
                    throw new Error('Empty response from AI');
                }

                return content.trim();

            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }

        setAPIKey(key) {
            if (!key || key.length < 20) {
                console.error('❌ Invalid API key');
                return false;
            }
            
            // Update both localStorage and CONFIG
            localStorage.setItem('openrouter_api_key', key);
            CONFIG.openRouter.apiKey = key;
            
            console.log('✅ OpenRouter API key configured successfully');
            console.log('🔑 Key preview:', key.substring(0, 15) + '...');
            
            showToast('API key configured!', 'success');
            return true;
        }
    }

    // ==========================================
    // VOICE SYSTEM
    // ==========================================
    class VoiceSystem {
        constructor() {
            this.recognition = null;
            this.synthesis = window.speechSynthesis;
            this.isListening = false;
            this.isSpeaking = false;
            this.initSpeechRecognition();
        }

        initSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.lang = 'en-US';

                this.recognition.onstart = () => {
                    this.isListening = true;
                    state.isListening = true;
                    updateVoiceUI();
                    showToast('Listening... Speak now', 'info');
                };

                this.recognition.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    const input = document.getElementById('chatbot-input');
                    if (input) {
                        if (finalTranscript) {
                            input.value = finalTranscript;
                            this.processVoiceCommand(finalTranscript);
                        } else if (interimTranscript) {
                            input.value = interimTranscript;
                        }
                    }
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    showToast(`Voice error: ${event.error}`, 'error');
                    this.stopListening();
                };

                this.recognition.onend = () => {
                    this.stopListening();
                };
            }
        }

        processVoiceCommand(text) {
            const commands = {
                'clear chat': () => clearChat(),
                'new chat': () => clearChat(),
                'delete chat': () => clearChat(),
                'repeat': () => repeatLastMessage(),
                'say again': () => repeatLastMessage(),
                'stop speaking': () => this.stopSpeaking(),
                'stop': () => this.stopSpeaking(),
                'dark mode': () => setTheme('dark'),
                'light mode': () => setTheme('light')
            };

            const lowerText = text.toLowerCase().trim();
            for (const [cmd, action] of Object.entries(commands)) {
                if (lowerText.includes(cmd)) {
                    action();
                    return true;
                }
            }
            return false;
        }

        startListening() {
            if (!this.recognition) {
                showToast('Voice input not supported in this browser', 'error');
                return;
            }

            if (this.isListening) {
                this.stopListening();
                return;
            }

            try {
                this.recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                showToast('Could not start voice input', 'error');
            }
        }

        stopListening() {
            this.isListening = false;
            state.isListening = false;
            if (this.recognition) {
                this.recognition.stop();
            }
            updateVoiceUI();
        }

        speak(text) {
            if (!CONFIG.ui.autoSpeak || !this.synthesis) return;

            this.stopSpeaking();

            // Clean text for speech
            const cleanText = text
                .replace(/```[\s\S]*?```/g, 'Code block omitted.')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\*\*|__/g, '')
                .substring(0, 500);

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Select good voice
            const voices = this.synthesis.getVoices();
            const preferredVoice = voices.find(v => 
                v.name.includes('Google US English') || 
                v.name.includes('Samantha') ||
                v.name.includes('Microsoft Zira')
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onstart = () => {
                this.isSpeaking = true;
                state.isSpeaking = true;
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                state.isSpeaking = false;
            };

            this.synthesis.speak(utterance);
        }

        stopSpeaking() {
            if (this.synthesis) {
                this.synthesis.cancel();
            }
            this.isSpeaking = false;
            state.isSpeaking = false;
        }
    }

    // ==========================================
    // PERSISTENT STORAGE (Firebase)
    // ==========================================
    class PersistentStorage {
        constructor() {
            this.db = null;
            this.isOnline = navigator.onLine;
            this.syncQueue = [];
            this.init();
        }

        async init() {
            // Initialize IndexedDB for local storage
            this.localDB = await this.initIndexedDB();
            
            // Load from local first
            await this.loadFromLocal();

            // Setup online/offline handlers
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.syncToCloud();
                showToast('Connection restored', 'success');
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                showToast('Offline mode - changes saved locally', 'warning');
            });
        }

        initIndexedDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(CONFIG.storage.dbName, 1);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('messages')) {
                        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                    }
                    if (!db.objectStoreNames.contains('sessions')) {
                        db.createObjectStore('sessions', { keyPath: 'sessionId' });
                    }
                };
            });
        }

        async saveMessage(message) {
            // Save to local IndexedDB
            await this.saveToLocal(message);

            // Try to sync to Firebase if online
            if (this.isOnline && this.db) {
                try {
                    await this.saveToFirebase(message);
                } catch (error) {
                    console.warn('Firebase save failed, queued for sync:', error);
                    this.queueForSync(message);
                }
            } else {
                this.queueForSync(message);
            }
        }

        async saveToLocal(message) {
            return new Promise((resolve, reject) => {
                const transaction = this.localDB.transaction(['messages'], 'readwrite');
                const store = transaction.objectStore('messages');
                const request = store.add(message);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async loadFromLocal() {
            return new Promise((resolve, reject) => {
                const transaction = this.localDB.transaction(['messages'], 'readonly');
                const store = transaction.objectStore('messages');
                const request = store.getAll();

                request.onsuccess = () => {
                    const messages = request.result
                        .filter(m => m.sessionId === state.sessionId)
                        .sort((a, b) => a.timestamp - b.timestamp);
                    
                    state.messages = messages;
                    resolve(messages);
                };

                request.onerror = () => reject(request.error);
            });
        }

        queueForSync(message) {
            this.syncQueue.push(message);
            localStorage.setItem('chatbot_sync_queue', JSON.stringify(this.syncQueue));
        }

        async syncToCloud() {
            if (!this.db || this.syncQueue.length === 0) return;

            const queue = [...this.syncQueue];
            const failed = [];

            for (const message of queue) {
                try {
                    await this.saveToFirebase(message);
                } catch (error) {
                    failed.push(message);
                }
            }

            this.syncQueue = failed;
            localStorage.setItem('chatbot_sync_queue', JSON.stringify(failed));

            if (failed.length === 0) {
                console.log('✅ All messages synced to cloud');
            }
        }

        async saveToFirebase(message) {
            // This will be implemented when Firebase is initialized
            if (window.firebaseDB) {
                const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                await addDoc(collection(window.firebaseDB, 'chat_messages'), {
                    ...message,
                    userId: state.userId,
                    synced: true
                });
            }
        }

        async getChatHistory(limit = 50) {
            const transaction = this.localDB.transaction(['messages'], 'readonly');
            const store = transaction.objectStore('messages');
            const request = store.getAll();

            return new Promise((resolve) => {
                request.onsuccess = () => {
                    const messages = request.result
                        .filter(m => m.userId === state.userId)
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, limit);
                    resolve(messages);
                };
            });
        }

        async clearHistory() {
            const transaction = this.localDB.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            await store.clear();
            state.messages = [];
        }
    }

    // ==========================================
    // FILE UPLOAD & ANALYSIS
    // ==========================================
    class FileAnalyzer {
        constructor() {
            this.supportedTypes = {
                'application/pdf': 'pdf',
                'image/png': 'image',
                'image/jpeg': 'image',
                'image/jpg': 'image',
                'text/plain': 'text'
            };
        }

        async handleUpload(file) {
            if (!this.supportedTypes[file.type]) {
                throw new Error(`Unsupported file type: ${file.type}. Please upload PDF, image, or text file.`);
            }

            const type = this.supportedTypes[file.type];
            
            showToast(`Processing ${type}...`, 'info');

            try {
                let content = '';

                switch (type) {
                    case 'pdf':
                        content = await this.extractPDF(file);
                        break;
                    case 'image':
                        content = await this.analyzeImage(file);
                        break;
                    case 'text':
                        content = await this.readText(file);
                        break;
                }

                state.uploadedFile = {
                    name: file.name,
                    type: type,
                    content: content,
                    size: file.size
                };

                return {
                    success: true,
                    type: type,
                    content: content,
                    preview: this.generatePreview(content, type)
                };

            } catch (error) {
                console.error('File processing error:', error);
                throw new Error(`Failed to process file: ${error.message}`);
            }
        }

        async extractPDF(file) {
            // For now, we'll use a simple text extraction
            // In production, you'd use pdf.js or similar
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Basic text extraction (first 5000 chars)
                    const text = reader.result.substring(0, 5000);
                    resolve(`[PDF Content: ${file.name}]\n\n${text}...`);
                };
                reader.readAsText(file);
            });
        }

        async analyzeImage(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(`[Image: ${file.name}]\n[Image data available for analysis]`);
                };
                reader.readAsDataURL(file);
            });
        }

        async readText(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsText(file);
            });
        }

        generatePreview(content, type) {
            if (type === 'image') {
                return content; // Base64 image
            }
            return content.substring(0, 200) + '...';
        }

        clear() {
            state.uploadedFile = null;
        }
    }

    // ==========================================
    // UI MANAGER
    // ==========================================
    class UIManager {
        constructor() {
            this.elements = {};
            this.init();
        }

        init() {
            this.createChatbotUI();
            this.bindEvents();
            this.applyTheme(state.theme);
        }

        createChatbotUI() {
            // Check if already exists
            if (document.getElementById('chatbot-pro-container')) return;

            const container = document.createElement('div');
            container.id = 'chatbot-pro-container';
            container.className = `chatbot-pro theme-${state.theme}`;
            container.innerHTML = `
                <!-- Toggle Button -->
                <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
                    <span class="toggle-icon">🤖</span>
                    <span class="toggle-pulse"></span>
                </button>

                <!-- Chat Window -->
                <div class="chatbot-window" id="chatbot-window">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div class="header-left">
                            <span class="header-icon">🤖</span>
                            <div class="header-info">
                                <h3>AI Assistant</h3>
                                <span class="status" id="chatbot-status">Online</span>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="action-btn" id="theme-toggle" title="Toggle theme">
                                ${state.theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <button class="action-btn" id="search-toggle" title="Search">
                                🔍
                            </button>
                            <button class="action-btn" id="export-chat" title="Export to PDF">
                                📄
                            </button>
                            <button class="action-btn close-btn" id="chatbot-close" title="Close">
                                ✕
                            </button>
                        </div>
                    </div>

                    <!-- Search Bar -->
                    <div class="search-bar" id="search-bar" style="display: none;">
                        <input type="text" placeholder="Search messages..." id="search-input">
                        <button id="search-close">✕</button>
                    </div>

                    <!-- Messages Area -->
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="welcome-message">
                            <div class="welcome-icon">👋</div>
                            <h4>Welcome to AI Assistant</h4>
                            <p>I can help with coding, studying, general questions, and more!</p>
                            <div class="quick-actions">
                                <button data-prompt="Explain quantum computing simply">Quantum</button>
                                <button data-prompt="Write a Python function to sort a list">Python</button>
                                <button data-prompt="Help me understand photosynthesis">Biology</button>
                                <button data-prompt="What are React hooks?">React</button>
                            </div>
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div class="typing-indicator" id="typing-indicator" style="display: none;">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>AI is thinking...</span>
                    </div>

                    <!-- File Preview -->
                    <div class="file-preview" id="file-preview" style="display: none;">
                        <span class="file-name"></span>
                        <button class="file-remove">✕</button>
                    </div>

                    <!-- Input Area -->
                    <div class="chatbot-input-area">
                        <div class="input-wrapper">
                            <button class="input-btn file-btn" id="file-upload-btn" title="Upload file">
                                📎
                            </button>
                            <input type="file" id="file-input" accept=".pdf,.png,.jpg,.jpeg,.txt" style="display: none;">
                            
                            <button class="input-btn voice-btn" id="voice-btn" title="Voice input">
                                🎤
                            </button>
                            
                            <textarea 
                                id="chatbot-input" 
                                placeholder="Type your message..."
                                rows="1"
                            ></textarea>
                            
                            <button class="send-btn" id="send-btn" disabled>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div class="input-hint">
                            <span>Press Enter to send</span>
                            <span class="voice-hint" id="voice-hint" style="display: none;">Listening...</span>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            this.cacheElements();
        }

        cacheElements() {
            this.elements = {
                container: document.getElementById('chatbot-pro-container'),
                toggle: document.getElementById('chatbot-toggle'),
                window: document.getElementById('chatbot-window'),
                messages: document.getElementById('chatbot-messages'),
                input: document.getElementById('chatbot-input'),
                sendBtn: document.getElementById('send-btn'),
                typing: document.getElementById('typing-indicator'),
                status: document.getElementById('chatbot-status'),
                voiceBtn: document.getElementById('voice-btn'),
                voiceHint: document.getElementById('voice-hint'),
                fileInput: document.getElementById('file-input'),
                filePreview: document.getElementById('file-preview'),
                searchBar: document.getElementById('search-bar'),
                searchInput: document.getElementById('search-input')
            };
        }

        bindEvents() {
            const { toggle, window: chatWindow, input, sendBtn, voiceBtn, fileInput } = this.elements;

            // Toggle chat
            toggle?.addEventListener('click', () => this.toggleChat());
            document.getElementById('chatbot-close')?.addEventListener('click', () => this.closeChat());

            // Send message
            sendBtn?.addEventListener('click', () => this.sendMessage());
            input?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            input?.addEventListener('input', () => this.autoResize(input));

            // Voice
            voiceBtn?.addEventListener('click', () => voiceSystem.startListening());

            // File upload
            document.getElementById('file-upload-btn')?.addEventListener('click', () => fileInput?.click());
            fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
            document.querySelector('.file-remove')?.addEventListener('click', () => this.clearFile());

            // Theme toggle
            document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

            // Search
            document.getElementById('search-toggle')?.addEventListener('click', () => this.toggleSearch());
            document.getElementById('search-close')?.addEventListener('click', () => this.toggleSearch());
            this.elements.searchInput?.addEventListener('input', (e) => this.searchMessages(e.target.value));

            // Export
            document.getElementById('export-chat')?.addEventListener('click', () => this.exportToPDF());

            // Quick actions
            document.querySelectorAll('.quick-actions button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const prompt = btn.dataset.prompt;
                    if (prompt) {
                        input.value = prompt;
                        this.autoResize(input);
                        this.sendMessage();
                    }
                });
            });
        }

        toggleChat() {
            state.isOpen = !state.isOpen;
            this.elements.window.classList.toggle('open', state.isOpen);
            this.elements.toggle.classList.toggle('active', state.isOpen);
            
            if (state.isOpen) {
                this.elements.input?.focus();
            }
        }

        closeChat() {
            state.isOpen = false;
            this.elements.window.classList.remove('open');
            this.elements.toggle.classList.remove('active');
        }

        async sendMessage() {
            const message = this.elements.input?.value.trim();
            if (!message || state.isTyping) return;

            // Clear input
            this.elements.input.value = '';
            this.autoResize(this.elements.input);
            this.elements.sendBtn.disabled = true;

            // Hide welcome message
            const welcome = this.elements.messages.querySelector('.welcome-message');
            if (welcome) welcome.remove();

            // Add user message
            this.addMessage('user', message);

            // Show typing
            this.showTyping(true);
            state.isTyping = true;

            try {
                // Prepare context
                const history = state.messages.slice(-10);
                let fullMessage = message;

                // Include file content if uploaded
                if (state.uploadedFile) {
                    fullMessage = `[File: ${state.uploadedFile.name}]\n\n${state.uploadedFile.content}\n\nUser question: ${message}`;
                }

                // Get AI response
                const result = await aiSystem.generateResponse(
                    fullMessage,
                    getSystemPrompt(),
                    history
                );

                // Hide typing
                this.showTyping(false);
                state.isTyping = false;

                if (result.success) {
                    // Add AI message with source info
                    this.addMessage('assistant', result.response, { 
                        model: result.model,
                        offline: result.offline,
                        subject: result.subject
                    });
                    
                    // Speak response
                    voiceSystem.speak(result.response);

                    // Save to storage
                    await storage.saveMessage({
                        id: Date.now(),
                        sessionId: state.sessionId,
                        userId: state.userId,
                        role: 'assistant',
                        content: result.response,
                        model: result.model,
                        source: result.source,
                        offline: result.offline,
                        timestamp: Date.now()
                    });
                }

            } catch (error) {
                this.showTyping(false);
                state.isTyping = false;
                console.error('Chat error:', error);
                this.addMessage('assistant', `❌ Error: ${error.message}. Please try again.`, { isError: true });
            }

            // Clear file after processing
            this.clearFile();
        }

        addMessage(role, content, options = {}) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}`;
            if (options.isError) messageDiv.classList.add('error');

            const avatar = role === 'user' ? '👤' : '🤖';
            const formattedContent = this.formatContent(content);

            let metaHtml = '';
            if (options.model) {
                metaHtml = `<span class="message-model">${options.model}</span>`;
            }

            messageDiv.innerHTML = `
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">
                    <div class="message-text">${formattedContent}</div>
                    <div class="message-meta">
                        ${metaHtml}
                        <button class="copy-btn" title="Copy">📋</button>
                        ${role === 'assistant' ? '<button class="speak-btn" title="Read aloud">🔊</button>' : ''}
                    </div>
                </div>
            `;

            // Bind copy button
            messageDiv.querySelector('.copy-btn')?.addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                showToast('Copied!', 'success');
            });

            // Bind speak button
            messageDiv.querySelector('.speak-btn')?.addEventListener('click', () => {
                voiceSystem.speak(content);
            });

            this.elements.messages.appendChild(messageDiv);
            this.scrollToBottom();

            // Save to state
            state.messages.push({
                role,
                content,
                timestamp: Date.now(),
                model: options.model
            });
        }

        formatContent(content) {
            // Escape HTML
            let formatted = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Code blocks
            formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
            });

            // Inline code
            formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

            // Bold
            formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

            // Italic
            formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

            // Line breaks
            formatted = formatted.replace(/\n/g, '<br>');

            return formatted;
        }

        showTyping(show) {
            this.elements.typing.style.display = show ? 'flex' : 'none';
            if (show) this.scrollToBottom();
        }

        scrollToBottom() {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
            this.elements.sendBtn.disabled = !textarea.value.trim();
        }

        async handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            try {
                const result = await fileAnalyzer.handleUpload(file);
                if (result.success) {
                    this.elements.filePreview.style.display = 'flex';
                    this.elements.filePreview.querySelector('.file-name').textContent = file.name;
                    showToast(`${result.type} uploaded successfully`, 'success');
                }
            } catch (error) {
                showToast(error.message, 'error');
            }

            // Reset input
            event.target.value = '';
        }

        clearFile() {
            fileAnalyzer.clear();
            this.elements.filePreview.style.display = 'none';
        }

        toggleTheme() {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('chatbot_theme', state.theme);
            this.applyTheme(state.theme);
            
            const themeBtn = document.getElementById('theme-toggle');
            themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
        }

        applyTheme(theme) {
            this.elements.container?.classList.remove('theme-dark', 'theme-light');
            this.elements.container?.classList.add(`theme-${theme}`);
        }

        toggleSearch() {
            const isVisible = this.elements.searchBar.style.display !== 'none';
            this.elements.searchBar.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                this.elements.searchInput.focus();
            }
        }

        searchMessages(query) {
            const messages = this.elements.messages.querySelectorAll('.message');
            messages.forEach(msg => {
                const text = msg.textContent.toLowerCase();
                msg.style.display = text.includes(query.toLowerCase()) ? 'flex' : 'none';
            });
        }

        exportToPDF() {
            const chatContent = state.messages.map(m => {
                return `${m.role.toUpperCase()}: ${m.content}`;
            }).join('\n\n');

            const blob = new Blob([chatContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);

            showToast('Chat exported!', 'success');
        }
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function generateUserId() {
        const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('neuroquest_user_id', id);
        return id;
    }

    function getSystemPrompt() {
        return `You are NeuroQuest AI, a powerful and intelligent assistant. You help with:

1. CODING: Write clean, working code with explanations
2. STUDYING: Explain concepts step-by-step with examples  
3. GENERAL: Answer any question clearly and accurately
4. FILE ANALYSIS: Analyze uploaded documents and images

GUIDELINES:
- Start with a direct, clear answer
- Use code blocks for programming (\`\`\`language)
- Use bullet points for structured info
- Be helpful, accurate, and thorough
- If unsure, say so honestly`;
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    function updateVoiceUI() {
        const voiceBtn = document.getElementById('voice-btn');
        const voiceHint = document.getElementById('voice-hint');
        
        if (voiceBtn) {
            voiceBtn.classList.toggle('listening', state.isListening);
        }
        if (voiceHint) {
            voiceHint.style.display = state.isListening ? 'block' : 'none';
        }
    }

    function clearChat() {
        state.messages = [];
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">👋</div>
                    <h4>Welcome to AI Assistant</h4>
                    <p>I can help with coding, studying, general questions, and more!</p>
                    <div class="quick-actions">
                        <button data-prompt="Explain quantum computing simply">Quantum</button>
                        <button data-prompt="Write a Python function to sort a list">Python</button>
                        <button data-prompt="Help me understand photosynthesis">Biology</button>
                        <button data-prompt="What are React hooks?">React</button>
                    </div>
                </div>
            `;
        }
        showToast('Chat cleared', 'success');
    }

    function repeatLastMessage() {
        const lastMessage = state.messages.filter(m => m.role === 'assistant').pop();
        if (lastMessage) {
            voiceSystem.speak(lastMessage.content);
        }
    }

    function setTheme(theme) {
        state.theme = theme;
        localStorage.setItem('chatbot_theme', theme);
        uiManager.applyTheme(theme);
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    let aiSystem, voiceSystem, storage, fileAnalyzer, uiManager;

    function init() {
        // Load API key
        CONFIG.openRouter.apiKey = localStorage.getItem('openrouter_api_key') || '';

        // Initialize systems
        aiSystem = new MultiModelAI();
        voiceSystem = new VoiceSystem();
        storage = new PersistentStorage();
        fileAnalyzer = new FileAnalyzer();
        uiManager = new UIManager();

        // Expose global functions
        window.ChatbotPro = {
            setAPIKey: (key) => aiSystem.setAPIKey(key),
            clearChat,
            toggleTheme: () => uiManager.toggleTheme(),
            toggleVoice: () => voiceSystem.startListening(),
            exportChat: () => uiManager.exportToPDF(),
            getState: () => ({ ...state }),
            getOfflineStats: () => OfflineKnowledgeSystem.getStats(),
            testOffline: (question) => OfflineKnowledgeSystem.handle(question)
        };

        console.log('✅ Chatbot Pro initialized with Hybrid AI + Offline Knowledge');
        console.log('💡 Set API key: ChatbotPro.setAPIKey("your-key")');
        console.log('📚 Offline knowledge stats:', OfflineKnowledgeSystem.getStats());
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();