/**
 * NeuroQuest Academic Chatbot Engine
 * Complete Offline Training System
 * 
 * Features:
 * - Intent Detection
 * - Subject Detection
 * - Level Detection
 * - Knowledge Base Search
 * - Math Solver
 * - Response Formatter
 * - Memory System
 * - Continuous Learning
 */

(function() {
    'use strict';

    // ==========================================
    // ACADEMIC CHATBOT ENGINE
    // ==========================================
    class AcademicChatbot {
        constructor() {
            this.knowledgeBase = window.ACADEMIC_KNOWLEDGE_BASE || {};
            this.memory = this.loadMemory();
            this.unansweredQuestions = this.loadUnanswered();
            this.trainingMode = false;
            
            console.log('🎓 NeuroQuest Academic Chatbot initialized');
            console.log('📚 Knowledge Base loaded');
            console.log(`💾 Memory: ${this.memory.length} conversations`);
        }

        // ==========================================
        // MAIN RESPONSE HANDLER
        // ==========================================
        async getResponse(userMessage, studentLevel = 'auto') {
            console.log(`\n🎯 Processing: "${userMessage}"`);
            
            // Step 1: Check intents (greetings, thanks, etc.)
            const intentResponse = this.checkIntent(userMessage);
            if (intentResponse) {
                console.log('✅ Intent matched');
                return intentResponse;
            }

            // Step 2: Try knowledge base
            const kbResponse = this.searchKnowledgeBase(userMessage, studentLevel);
            if (kbResponse) {
                console.log('✅ Knowledge base match found');
                this.saveToMemory(userMessage, kbResponse);
                return kbResponse;
            }

            // Step 3: Try math solver
            const mathResponse = this.solveMath(userMessage);
            if (mathResponse) {
                console.log('✅ Math solved');
                this.saveToMemory(userMessage, mathResponse);
                return mathResponse;
            }

            // Step 4: Store unanswered for training
            this.addUnanswered(userMessage);
            
            // Step 5: Return fallback
            return this.getFallbackResponse(userMessage);
        }

        // ==========================================
        // 1. INTENT DETECTION
        // ==========================================
        checkIntent(message) {
            const lower = message.toLowerCase().trim();
            
            // Greetings
            if (/^(hi|hello|hey|greetings|howdy|sup)\b/.test(lower)) {
                const responses = [
                    "Hello! I'm your academic tutor. What would you like to learn today?",
                    "Hey there! Ready to learn? Ask me anything about Math, Science, English, or Coding!",
                    "Hi! I'm here to help you study. What subject should we explore?"
                ];
                return this.randomChoice(responses);
            }

            // How are you
            if (/how are you|how('s| is) it going/.test(lower)) {
                return "I'm doing great! Thanks for asking! Ready to help you learn. What's your question?";
            }

            // Thanks
            if (/^(thanks|thank you|thx|ty)\b/.test(lower)) {
                const responses = [
                    "You're welcome! Happy to help! Any other questions?",
                    "My pleasure! Keep learning and growing!",
                    "Anytime! That's what I'm here for!"
                ];
                return this.randomChoice(responses);
            }

            // Goodbye
            if (/^(bye|goodbye|see you|later)\b/.test(lower)) {
                const responses = [
                    "Goodbye! Keep studying and come back anytime!",
                    "See you later! Don't forget to practice what you learned!",
                    "Bye! Remember, learning is a journey, not a destination!"
                ];
                return this.randomChoice(responses);
            }

            // Help
            if (/^(help|what can you do|how to use)/.test(lower)) {
                return `I can help you with:

📐 MATHEMATICS
   - Arithmetic (addition, subtraction, etc.)
   - Algebra, Geometry, Calculus
   - Step-by-step solutions

🔬 SCIENCE
   - Physics, Chemistry, Biology
   - Concepts with examples
   - Real-world applications

📝 ENGLISH
   - Grammar (nouns, verbs, tenses)
   - Literature, Writing
   - Figures of speech

💻 CODING
   - Programming basics
   - Python, JavaScript
   - Data structures

🌍 GENERAL KNOWLEDGE
   - History, Geography
   - Current affairs
   - Fun facts

Just ask your question, and I'll help! 🎯`;
            }

            return null;
        }

        // ==========================================
        // 2. SUBJECT DETECTION
        // ==========================================
        detectSubject(message) {
            const lower = message.toLowerCase();
            
            // Math keywords
            const mathKeywords = ['math', 'add', 'subtract', 'multiply', 'divide', 'plus', 'minus', 
                                 'equation', 'algebra', 'geometry', 'calculus', 'number', 'calculate',
                                 'square', 'root', 'fraction', 'percentage', 'theorem'];
            
            // Science keywords
            const scienceKeywords = ['science', 'physics', 'chemistry', 'biology', 'atom', 'cell',
                                    'gravity', 'force', 'energy', 'reaction', 'element', 'plant',
                                    'photosynthesis', 'dna', 'organism', 'experiment'];
            
            // English keywords
            const englishKeywords = ['english', 'grammar', 'noun', 'verb', 'adjective', 'tense',
                                    'sentence', 'paragraph', 'essay', 'writing', 'literature',
                                    'simile', 'metaphor', 'poem'];
            
            // Coding keywords
            const codingKeywords = ['code', 'programming', 'python', 'javascript', 'function',
                                   'variable', 'loop', 'array', 'object', 'class', 'computer',
                                   'software', 'algorithm', 'data structure'];
            
            // GK keywords
            const gkKeywords = ['history', 'geography', 'capital', 'country', 'president',
                               'independence', 'war', 'constitution', 'culture', 'tradition'];

            if (mathKeywords.some(kw => lower.includes(kw))) return 'math';
            if (scienceKeywords.some(kw => lower.includes(kw))) return 'science';
            if (englishKeywords.some(kw => lower.includes(kw))) return 'english';
            if (codingKeywords.some(kw => lower.includes(kw))) return 'coding';
            if (gkKeywords.some(kw => lower.includes(kw))) return 'gk';
            
            return 'general';
        }

        // ==========================================
        // 3. LEVEL DETECTION
        // ==========================================
        detectLevel(message) {
            const lower = message.toLowerCase();
            
            // Simple questions = younger students
            const simplePatterns = [/what is \d/, /count/, /plus|minus/, /what (is|are) (a |the )?(cat|dog|water|sun|plant)/];
            
            // Medium complexity
            const mediumPatterns = [/explain/, /how does/, /why is/, /what is (gravity|force|energy|atom)/];
            
            // Advanced
            const advancedPatterns = [/derivative|integral|calculus/, /quantum|relativity/, /quadratic|polynomial/,
                                     /oop|object oriented/, /chemical reaction|equation/];

            if (advancedPatterns.some(p => p.test(lower))) return 'high_9_to_12';
            if (mediumPatterns.some(p => p.test(lower))) return 'middle_6_to_8';
            if (simplePatterns.some(p => p.test(lower))) return 'nursery_to_2';
            
            return 'elementary_3_to_5'; // Default
        }

        // ==========================================
        // 4. KNOWLEDGE BASE SEARCH
        // ==========================================
        searchKnowledgeBase(message, autoLevel = 'auto') {
            const lower = message.toLowerCase().trim();
            const detectedSubject = this.detectSubject(message);
            const detectedLevel = autoLevel === 'auto' ? this.detectLevel(message) : autoLevel;
            
            console.log(`🔍 Subject: ${detectedSubject}, Level: ${detectedLevel}`);
            
            // Search in detected subject and level
            const subjects = [detectedSubject, 'general'];
            
            for (const subject of subjects) {
                if (!this.knowledgeBase[subject]) continue;
                
                const levels = [detectedLevel];
                
                // Also check other levels if not found
                if (detectedLevel === 'middle_6_to_8') {
                    levels.push('elementary_3_to_5', 'high_9_to_12');
                }
                
                for (const level of levels) {
                    if (!this.knowledgeBase[subject][level]) continue;
                    
                    const topics = this.knowledgeBase[subject][level];
                    
                    // Search for matching question
                    for (const [question, answer] of Object.entries(topics)) {
                        if (this.isMatch(lower, question)) {
                            console.log(`✅ Found: "${question}"`);
                            return this.formatResponse(answer, subject, level);
                        }
                    }
                }
            }
            
            return null;
        }

        // Check if message matches question
        isMatch(userMessage, kbQuestion) {
            // Exact match
            if (userMessage === kbQuestion) return true;
            
            // Contains key terms (80% match)
            const userWords = userMessage.replace(/[^\w\s]/g, '').split(/\s+/);
            const kbWords = kbQuestion.replace(/[^\w\s]/g, '').split(/\s+/);
            
            const matches = kbWords.filter(word => 
                word.length > 2 && userWords.some(uw => uw.includes(word) || word.includes(uw))
            );
            
            return matches.length >= Math.min(2, kbWords.length * 0.8);
        }

        // Format response (clean, no metadata)
        formatResponse(answer, subject, level) {
            // Return just the answer without any metadata
            return answer;
        }

        // ==========================================
        // 5. MATH SOLVER ENGINE
        // ==========================================
        solveMath(message) {
            try {
                const lower = message.toLowerCase();
                
                // Extract math expression
                let expression = lower
                    .replace(/what is|calculate|solve|equals?/g, '')
                    .replace(/plus/g, '+')
                    .replace(/minus/g, '-')
                    .replace(/times|multiplied by|multiply/g, '*')
                    .replace(/divided by|divide|over/g, '/')
                    .replace(/[^\d+\-*/().\s]/g, '')
                    .trim();

                if (!expression || expression.length < 3) return null;

                // Safety check
                if (!/^[\d+\-*/().\s]+$/.test(expression)) return null;

                // Evaluate safely
                const result = Function('"use strict"; return (' + expression + ')')();
                
                if (isNaN(result) || !isFinite(result)) return null;

                // Build step-by-step solution
                const steps = this.generateMathSteps(expression, result);

                return `🧮 MATH SOLVER

${steps}

✅ Final Answer: ${expression} = ${result}`;
                
            } catch (e) {
                return null;
            }
        }

        generateMathSteps(expression, result) {
            // Simple step generator
            const parts = expression.match(/[\d.]+|[+\-*/]/g);
            
            if (!parts || parts.length < 3) {
                return `Expression: ${expression}`;
            }

            let steps = `Expression: ${expression}\n\n`;
            steps += `Step 1: Identify the operation\n`;
            steps += `Step 2: Calculate\n`;
            steps += `Step 3: Result = ${result}\n`;
            
            return steps;
        }

        // ==========================================
        // 8. MEMORY SYSTEM
        // ==========================================
        saveToMemory(question, answer) {
            this.memory.push({
                question,
                answer,
                timestamp: Date.now(),
                subject: this.detectSubject(question)
            });

            // Keep only last 50 conversations
            if (this.memory.length > 50) {
                this.memory = this.memory.slice(-50);
            }

            this.persistMemory();
        }

        loadMemory() {
            try {
                const saved = localStorage.getItem('neuroquest_academic_memory');
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }

        persistMemory() {
            try {
                localStorage.setItem('neuroquest_academic_memory', JSON.stringify(this.memory));
            } catch (e) {
                console.warn('⚠️ Could not save memory');
            }
        }

        // ==========================================
        // 9. CONTINUOUS LEARNING SYSTEM
        // ==========================================
        addUnanswered(question) {
            this.unansweredQuestions.push({
                question,
                timestamp: Date.now(),
                attempts: 1,
                subject: this.detectSubject(question)
            });

            // Keep only last 100
            if (this.unansweredQuestions.length > 100) {
                this.unansweredQuestions = this.unansweredQuestions.slice(-100);
            }

            this.persistUnanswered();
            console.log(`📝 Unanswered question stored: "${question}"`);
        }

        loadUnanswered() {
            try {
                const saved = localStorage.getItem('neuroquest_unanswered_questions');
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }

        persistUnanswered() {
            try {
                localStorage.setItem('neuroquest_unanswered_questions', JSON.stringify(this.unansweredQuestions));
            } catch (e) {
                console.warn('⚠️ Could not save unanswered questions');
            }
        }

        // Get unanswered questions for training
        getUnansweredQuestions(limit = 10) {
            return this.unansweredQuestions.slice(-limit);
        }

        // ==========================================
        // 10. FALLBACK RESPONSE
        // ==========================================
        getFallbackResponse(message) {
            const fallbacks = [
                `🤔 That's a great question! I'm still learning about this topic.

Here's what you can do:
1. Try rephrasing your question
2. Ask about a specific concept
3. Check if it's in my knowledge base

💡 Tip: You can help train me by asking clear, specific questions!

Example: Instead of "tell me about science"
Try: "what is photosynthesis"`,

                `📚 I don't have a complete answer for this yet, but I'm improving every day!

For now, try:
- Asking about Math, Science, English, or Coding
- Being specific: "what is algebra" or "explain gravity"
- Using simple, clear questions

Your questions help me learn what to study next! 🎯`,

                `💭 I'm not fully sure about this yet, but here's what I can suggest:

🎓 Subjects I know well:
• Mathematics (arithmetic to calculus)
• Science (physics, chemistry, biology)
• English (grammar, literature)
• Coding (Python, JavaScript basics)
• General Knowledge

Ask me something specific from these topics! 📖`
            ];

            return this.randomChoice(fallbacks);
        }

        // ==========================================
        // UTILITY FUNCTIONS
        // ==========================================
        randomChoice(array) {
            return array[Math.floor(Math.random() * array.length)];
        }

        // Get statistics
        getStats() {
            const subjectCounts = {};
            this.memory.forEach(msg => {
                subjectCounts[msg.subject] = (subjectCounts[msg.subject] || 0) + 1;
            });

            return {
                totalConversations: this.memory.length,
                unansweredQuestions: this.unansweredQuestions.length,
                subjectBreakdown: subjectCounts,
                memorySize: this.memory.length
            };
        }

        // ==========================================
        // TRAINING MODE
        // ==========================================
        enableTrainingMode() {
            this.trainingMode = true;
            console.log('🎓 Training mode enabled');
        }

        addKnowledge(subject, level, question, answer) {
            if (!this.knowledgeBase[subject]) {
                this.knowledgeBase[subject] = {};
            }
            if (!this.knowledgeBase[subject][level]) {
                this.knowledgeBase[subject][level] = {};
            }
            
            this.knowledgeBase[subject][level][question.toLowerCase()] = answer;
            console.log(`✅ Added: [${subject}/${level}] "${question}"`);
        }
    }

    // ==========================================
    // EXPORT TO GLOBAL SCOPE
    // ==========================================
    window.AcademicChatbot = AcademicChatbot;
    
    // Create global instance
    window.academicBot = new AcademicChatbot();

    console.log('✅ NeuroQuest Academic Chatbot Engine ready!');
    console.log('🎯 Use: window.academicBot.getResponse("your question")');

})();
