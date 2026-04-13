/**
 * AI Question Service - Frontend
 * Handles dynamic question generation and difficulty tracking
 */

const AIQuestionService = {
    // Cache for questions
    questionCache: [],
    currentDomain: 'General Knowledge',
    
    /**
     * Initialize service
     */
    init() {
        this.preloadQuestions();
    },

    /**
     * Get a question (from cache or API)
     */
    async getQuestion(domain = this.currentDomain) {
        // Return cached question if available
        if (this.questionCache.length > 0) {
            const question = this.questionCache.shift();
            this.preloadQuestions(domain); // Preload more in background
            return question;
        }

        // Fetch from API
        try {
            const response = await APIService.fetchWithAuth('/ai/question', {
                method: 'POST',
                body: JSON.stringify({ domain })
            });

            if (response.success) {
                this.preloadQuestions(domain);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to get AI question:', error);
        }

        // Fallback to static question
        return this.getFallbackQuestion(domain);
    },

    /**
     * Preload questions in background
     */
    async preloadQuestions(domain = this.currentDomain) {
        if (this.questionCache.length >= 3) return;

        try {
            const response = await APIService.fetchWithAuth('/ai/question-batch', {
                method: 'POST',
                body: JSON.stringify({ domain, count: 3 })
            });

            if (response.success && response.data) {
                this.questionCache.push(...response.data);
            }
        } catch (error) {
            console.log('Preload failed (non-critical):', error);
        }
    },

    /**
     * Submit answer and get feedback
     */
    async submitAnswer(questionData, selectedAnswer) {
        try {
            const response = await APIService.fetchWithAuth('/ai/answer', {
                method: 'POST',
                body: JSON.stringify({
                    questionId: questionData.id || Date.now(),
                    selectedAnswer,
                    correctAnswer: questionData.answer,
                    explanation: questionData.explanation,
                    domain: this.currentDomain
                })
            });

            return response.data;
        } catch (error) {
            console.error('Answer submission failed:', error);
            
            // Local fallback
            const isCorrect = selectedAnswer === questionData.answer;
            return {
                correct: isCorrect,
                correctAnswer: questionData.answer,
                explanation: questionData.explanation || 'No explanation available',
                difficulty: { currentDifficulty: 'medium' }
            };
        }
    },

    /**
     * Get current difficulty
     */
    async getDifficulty() {
        try {
            const response = await APIService.fetchWithAuth('/ai/difficulty');
            return response.data;
        } catch (error) {
            return { currentDifficulty: 'medium' };
        }
    },

    /**
     * Get user stats
     */
    async getStats() {
        try {
            const response = await APIService.fetchWithAuth('/ai/stats');
            return response.data;
        } catch (error) {
            return { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };
        }
    },

    /**
     * Set current domain
     */
    setDomain(domain) {
        this.currentDomain = domain;
        this.questionCache = []; // Clear cache for new domain
        this.preloadQuestions(domain);
    },

    /**
     * Fallback static questions
     */
    getFallbackQuestion(domain) {
        const fallbacks = {
            Programming: {
                question: 'What does "DOM" stand for in web development?',
                options: ['Data Object Model', 'Document Object Model', 'Digital Object Management', 'Dynamic Output Method'],
                answer: 'Document Object Model',
                explanation: 'DOM represents the page structure that JavaScript can manipulate.'
            },
            Physics: {
                question: 'Which law states that energy cannot be created or destroyed?',
                options: ['Newton\'s First Law', 'Law of Conservation of Energy', 'Ohm\'s Law', 'Boyle\'s Law'],
                answer: 'Law of Conservation of Energy',
                explanation: 'Energy transforms between forms but total energy remains constant.'
            },
            default: {
                question: 'What is the powerhouse of the cell?',
                options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
                answer: 'Mitochondria',
                explanation: 'Mitochondria produce ATP, the cell\'s energy currency.'
            }
        };

        return fallbacks[domain] || fallbacks.default;
    },

    /**
     * Clear cache
     */
    clearCache() {
        this.questionCache = [];
    }
};

// Auto-initialize if APIService is available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof APIService !== 'undefined') {
        AIQuestionService.init();
    }
});