/**
 * Smart Question System with Open Trivia DB
 * Isolated component - does not modify existing code
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        apiUrl: 'https://opentdb.com/api.php',
        cacheSize: 10,
        difficultyMap: {
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'hard'
        }
    };

    // State
    let userPerformance = {
        correctStreak: 0,
        wrongCount: 0,
        totalCorrect: 0,
        totalWrong: 0,
        currentDifficulty: 'medium'
    };

    let questionCache = [];
    let currentCategory = 9; // General Knowledge default

    // Category mapping
    const CATEGORIES = {
        'General Knowledge': 9,
        'Programming': 18, // Science: Computers
        'Science': 17, // Science & Nature
        'Mathematics': 19, // Science: Mathematics
        'History': 23,
        'Geography': 22,
        'Sports': 21,
        'Entertainment': 11 // Film
    };

    /**
     * Initialize smart question system
     */
    function init() {
        loadPerformance();
        preloadQuestions();
        
        // Listen for subject changes
        document.addEventListener('subjectSelected', (e) => {
            const subject = e.detail?.subject;
            if (subject && CATEGORIES[subject]) {
                currentCategory = CATEGORIES[subject];
                questionCache = []; // Clear cache for new category
                preloadQuestions();
            }
        });
    }

    /**
     * Load performance from localStorage
     */
    function loadPerformance() {
        const saved = localStorage.getItem('neuroquest-performance');
        if (saved) {
            userPerformance = JSON.parse(saved);
        }
    }

    /**
     * Save performance to localStorage
     */
    function savePerformance() {
        localStorage.setItem('neuroquest-performance', JSON.stringify(userPerformance));
    }

    /**
     * Adjust difficulty based on performance
     */
    function adjustDifficulty() {
        const total = userPerformance.totalCorrect + userPerformance.totalWrong;
        if (total < 5) return; // Need at least 5 questions

        const accuracy = userPerformance.totalCorrect / total;

        if (accuracy >= 0.8 && userPerformance.correctStreak >= 3) {
            // Increase difficulty
            if (userPerformance.currentDifficulty === 'easy') {
                userPerformance.currentDifficulty = 'medium';
            } else if (userPerformance.currentDifficulty === 'medium') {
                userPerformance.currentDifficulty = 'hard';
            }
            userPerformance.correctStreak = 0;
        } else if (accuracy < 0.5 && userPerformance.wrongCount >= 2) {
            // Decrease difficulty
            if (userPerformance.currentDifficulty === 'hard') {
                userPerformance.currentDifficulty = 'medium';
            } else if (userPerformance.currentDifficulty === 'medium') {
                userPerformance.currentDifficulty = 'easy';
            }
            userPerformance.wrongCount = 0;
        }

        savePerformance();
    }

    /**
     * Record answer and adjust difficulty
     */
    function recordAnswer(isCorrect) {
        if (isCorrect) {
            userPerformance.correctStreak++;
            userPerformance.wrongCount = 0;
            userPerformance.totalCorrect++;
        } else {
            userPerformance.wrongCount++;
            userPerformance.correctStreak = 0;
            userPerformance.totalWrong++;
        }

        adjustDifficulty();
        savePerformance();
        preloadQuestions(); // Preload with new difficulty

        return {
            difficulty: userPerformance.currentDifficulty,
            stats: {
                total: userPerformance.totalCorrect + userPerformance.totalWrong,
                correct: userPerformance.totalCorrect,
                accuracy: Math.round((userPerformance.totalCorrect / (userPerformance.totalCorrect + userPerformance.totalWrong)) * 100)
            }
        };
    }

    /**
     * Fetch question from Open Trivia DB
     */
    async function fetchQuestion() {
        try {
            const url = `${CONFIG.apiUrl}?amount=1&category=${currentCategory}&difficulty=${userPerformance.currentDifficulty}&type=multiple`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.response_code === 0 && data.results.length > 0) {
                return formatQuestion(data.results[0]);
            }
            throw new Error('No questions available');
        } catch (error) {
            console.error('Fetch error:', error);
            return getFallbackQuestion();
        }
    }

    /**
     * Format API question to app format
     */
    function formatQuestion(apiQuestion) {
        const options = [...apiQuestion.incorrect_answers, apiQuestion.correct_answer];
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            question: decodeHtml(apiQuestion.question),
            options: options.map(decodeHtml),
            answer: decodeHtml(apiQuestion.correct_answer),
            explanation: `The correct answer is: ${decodeHtml(apiQuestion.correct_answer)}`,
            difficulty: apiQuestion.difficulty,
            category: apiQuestion.category
        };
    }

    /**
     * Decode HTML entities
     */
    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    /**
     * Get fallback question
     */
    function getFallbackQuestion() {
        const fallbacks = [
            {
                question: 'What is the capital of France?',
                options: ['London', 'Berlin', 'Paris', 'Madrid'],
                answer: 'Paris',
                explanation: 'Paris is the capital and most populous city of France.'
            },
            {
                question: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                answer: 'Mars',
                explanation: 'Mars appears red due to iron oxide on its surface.'
            },
            {
                question: 'What is 2 + 2?',
                options: ['3', '4', '5', '6'],
                answer: '4',
                explanation: 'Basic arithmetic: 2 + 2 = 4'
            }
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    /**
     * Preload questions
     */
    async function preloadQuestions() {
        while (questionCache.length < CONFIG.cacheSize) {
            try {
                const question = await fetchQuestion();
                questionCache.push(question);
            } catch (error) {
                break;
            }
        }
    }

    /**
     * Get next question
     */
    async function getNextQuestion() {
        if (questionCache.length > 0) {
            const question = questionCache.shift();
            preloadQuestions(); // Refill cache
            return question;
        }
        return await fetchQuestion();
    }

    /**
     * Get current difficulty
     */
    function getCurrentDifficulty() {
        return userPerformance.currentDifficulty;
    }

    /**
     * Get performance stats
     */
    function getStats() {
        const total = userPerformance.totalCorrect + userPerformance.totalWrong;
        return {
            total,
            correct: userPerformance.totalCorrect,
            accuracy: total > 0 ? Math.round((userPerformance.totalCorrect / total) * 100) : 0,
            difficulty: userPerformance.currentDifficulty
        };
    }

    /**
     * Reset performance
     */
    function resetPerformance() {
        userPerformance = {
            correctStreak: 0,
            wrongCount: 0,
            totalCorrect: 0,
            totalWrong: 0,
            currentDifficulty: 'medium'
        };
        savePerformance();
        questionCache = [];
    }

    // Expose API globally
    window.SmartQuestions = {
        getNextQuestion,
        recordAnswer,
        getCurrentDifficulty,
        getStats,
        resetPerformance,
        setCategory: (subject) => {
            if (CATEGORIES[subject]) {
                currentCategory = CATEGORIES[subject];
                questionCache = [];
                preloadQuestions();
            }
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();