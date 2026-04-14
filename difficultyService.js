/**
 * Adaptive Difficulty Service
 * Adjusts question difficulty based on user performance
 */

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

/**
 * Track user performance and calculate difficulty
 */
class DifficultyTracker {
    constructor() {
        this.userSessions = new Map(); // In-memory storage (use Redis/DB in production)
    }

    /**
     * Get or create user session
     */
    getSession(userId) {
        if (!this.userSessions.has(userId)) {
            this.userSessions.set(userId, {
                currentDifficulty: 'medium',
                streak: 0,
                correctCount: 0,
                wrongCount: 0,
                history: [],
                lastUpdated: Date.now()
            });
        }
        return this.userSessions.get(userId);
    }

    /**
     * Record answer and update difficulty
     */
    recordAnswer(userId, isCorrect, domain) {
        const session = this.getSession(userId);
        
        // Update counts
        if (isCorrect) {
            session.correctCount++;
            session.streak = Math.min(session.streak + 1, 5);
            session.wrongCount = 0;
        } else {
            session.wrongCount++;
            session.streak = Math.max(session.streak - 1, -3);
            session.correctCount = 0;
        }

        // Record in history
        session.history.push({
            correct: isCorrect,
            domain,
            difficulty: session.currentDifficulty,
            timestamp: Date.now()
        });

        // Keep only last 20 entries
        if (session.history.length > 20) {
            session.history.shift();
        }

        // Adjust difficulty
        this.adjustDifficulty(userId);
        session.lastUpdated = Date.now();

        return {
            currentDifficulty: session.currentDifficulty,
            streak: session.streak,
            stats: this.getStats(userId)
        };
    }

    /**
     * Adjust difficulty based on performance
     */
    adjustDifficulty(userId) {
        const session = this.getSession(userId);
        const currentIndex = DIFFICULTY_LEVELS.indexOf(session.currentDifficulty);

        // Increase difficulty: 3 correct in a row
        if (session.correctCount >= 3 && currentIndex < DIFFICULTY_LEVELS.length - 1) {
            session.currentDifficulty = DIFFICULTY_LEVELS[currentIndex + 1];
            session.correctCount = 0; // Reset counter
            return;
        }

        // Decrease difficulty: 2 wrong in a row
        if (session.wrongCount >= 2 && currentIndex > 0) {
            session.currentDifficulty = DIFFICULTY_LEVELS[currentIndex - 1];
            session.wrongCount = 0; // Reset counter
            return;
        }

        // Gradual adjustment based on streak
        if (session.streak >= 5 && currentIndex < DIFFICULTY_LEVELS.length - 1) {
            session.currentDifficulty = DIFFICULTY_LEVELS[currentIndex + 1];
            session.streak = 0;
        } else if (session.streak <= -3 && currentIndex > 0) {
            session.currentDifficulty = DIFFICULTY_LEVELS[currentIndex - 1];
            session.streak = 0;
        }
    }

    /**
     * Get current difficulty for user
     */
    getCurrentDifficulty(userId) {
        const session = this.getSession(userId);
        return session.currentDifficulty;
    }

    /**
     * Get user statistics
     */
    getStats(userId) {
        const session = this.getSession(userId);
        const total = session.history.length;
        const correct = session.history.filter(h => h.correct).length;
        
        return {
            totalQuestions: total,
            correctAnswers: correct,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            currentStreak: session.streak,
            currentDifficulty: session.currentDifficulty
        };
    }

    /**
     * Reset user session
     */
    resetSession(userId) {
        this.userSessions.delete(userId);
    }

    /**
     * Cleanup old sessions (call periodically)
     */
    cleanup(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
        const now = Date.now();
        for (const [userId, session] of this.userSessions.entries()) {
            if (now - session.lastUpdated > maxAge) {
                this.userSessions.delete(userId);
            }
        }
    }
}

// Singleton instance
const difficultyTracker = new DifficultyTracker();

module.exports = difficultyTracker;