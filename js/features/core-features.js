/**
 * Core Features Implementation
 * Features 1, 4, 6, 7 - No UI changes, only backend logic
 */

(function() {
    'use strict';

    // ==========================================
    // FEATURE 1: LOGIN PERSISTENCE
    // ==========================================
    
    const AuthPersistence = {
        TOKEN_KEY: 'neuroquest_token',
        USER_KEY: 'neuroquest_user',
        
        init() {
            // Check for existing session on page load
            this.checkSession();
            
            // Intercept login to save token
            this.interceptLogin();
        },
        
        checkSession() {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const user = JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
            
            if (token && user) {
                // Verify token with backend
                fetch('http://localhost:5000/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Auto-login successful
                        console.log('Session restored for:', data.user.name);
                        if (typeof State !== 'undefined') {
                            State.user = { ...State.user, ...data.user };
                            State.isLoggedIn = true;
                        }
                    } else {
                        this.clearSession();
                    }
                })
                .catch(() => this.clearSession());
            }
        },
        
        interceptLogin() {
            // Store token after successful login
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const response = await originalFetch.apply(this, args);
                const url = args[0];
                
                if (url.includes('/api/auth/login') || url.includes('/api/auth/signup')) {
                    const clone = response.clone();
                    clone.json().then(data => {
                        if (data.success && data.token) {
                            localStorage.setItem(AuthPersistence.TOKEN_KEY, data.token);
                            localStorage.setItem(AuthPersistence.USER_KEY, JSON.stringify(data.user));
                        }
                    });
                }
                
                return response;
            };
        },
        
        clearSession() {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        },
        
        logout() {
            this.clearSession();
        }
    };

    // ==========================================
    // FEATURE 4: ADAPTIVE LEARNING & XP SYSTEM
    // ==========================================
    
    const AdaptiveLearning = {
        init() {
            this.loadUserStats();
            this.setupQuizTracking();
        },
        
        loadUserStats() {
            const stats = JSON.parse(localStorage.getItem('neuroquest_stats') || '{}');
            this.stats = {
                correctStreak: stats.correctStreak || 0,
                wrongStreak: stats.wrongStreak || 0,
                totalCorrect: stats.totalCorrect || 0,
                totalWrong: stats.totalWrong || 0,
                currentDifficulty: stats.currentDifficulty || 'medium',
                dailyStreak: stats.dailyStreak || 0,
                lastActive: stats.lastActive || null
            };
        },
        
        saveStats() {
            localStorage.setItem('neuroquest_stats', JSON.stringify(this.stats));
        },
        
        recordAnswer(isCorrect) {
            if (isCorrect) {
                this.stats.correctStreak++;
                this.stats.wrongStreak = 0;
                this.stats.totalCorrect++;
                
                // Bonus XP for streaks
                const streakBonus = Math.min(this.stats.correctStreak * 5, 25);
                this.addXP(10 + streakBonus);
            } else {
                this.stats.wrongStreak++;
                this.stats.correctStreak = 0;
                this.stats.totalWrong++;
            }
            
            this.adjustDifficulty();
            this.saveStats();
            this.checkDailyStreak();
            
            return {
                difficulty: this.stats.currentDifficulty,
                streak: this.stats.correctStreak,
                xpBonus: isCorrect ? Math.min(this.stats.correctStreak * 5, 25) : 0
            };
        },
        
        adjustDifficulty() {
            // Increase difficulty after 5 correct answers
            if (this.stats.correctStreak >= 5 && this.stats.currentDifficulty !== 'hard') {
                this.stats.currentDifficulty = this.stats.currentDifficulty === 'easy' ? 'medium' : 'hard';
                this.stats.correctStreak = 0;
                this.showNotification('Difficulty increased to ' + this.stats.currentDifficulty + '!');
            }
            // Decrease difficulty after 3 wrong answers
            else if (this.stats.wrongStreak >= 3 && this.stats.currentDifficulty !== 'easy') {
                this.stats.currentDifficulty = this.stats.currentDifficulty === 'hard' ? 'medium' : 'easy';
                this.stats.wrongStreak = 0;
                this.showNotification('Difficulty adjusted to ' + this.stats.currentDifficulty);
            }
        },
        
        addXP(amount) {
            const user = JSON.parse(localStorage.getItem('neuroquest_user') || '{}');
            if (user) {
                user.xp = (user.xp || 0) + amount;
                const newLevel = Math.floor(user.xp / 100) + 1;
                if (newLevel > (user.level || 1)) {
                    user.level = newLevel;
                    this.showNotification('Level Up! You are now Level ' + newLevel);
                }
                localStorage.setItem('neuroquest_user', JSON.stringify(user));
            }
        },
        
        checkDailyStreak() {
            const today = new Date().toDateString();
            const lastActive = this.stats.lastActive;
            
            if (lastActive) {
                const lastDate = new Date(lastActive).toDateString();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastDate === yesterday.toDateString()) {
                    this.stats.dailyStreak++;
                    this.addXP(this.stats.dailyStreak * 5); // Bonus for streak
                    this.showNotification('Daily Streak: ' + this.stats.dailyStreak + ' days! +' + (this.stats.dailyStreak * 5) + ' XP');
                } else if (lastDate !== today) {
                    this.stats.dailyStreak = 1;
                }
            } else {
                this.stats.dailyStreak = 1;
            }
            
            this.stats.lastActive = new Date().toISOString();
            this.saveStats();
        },
        
        getSmartFeedback() {
            const total = this.stats.totalCorrect + this.stats.totalWrong;
            if (total === 0) return null;
            
            const accuracy = (this.stats.totalCorrect / total) * 100;
            
            return {
                accuracy: Math.round(accuracy),
                strengths: accuracy > 70 ? ['Consistent performance', 'Good retention'] : [],
                weaknesses: accuracy < 50 ? ['Need more practice', 'Review fundamentals'] : [],
                suggestion: this.getNextTopicSuggestion()
            };
        },
        
        getNextTopicSuggestion() {
            const subjects = ['Programming', 'Mathematics', 'Science', 'History'];
            return subjects[Math.floor(Math.random() * subjects.length)];
        },
        
        showNotification(message) {
            if (typeof Toast !== 'undefined') {
                Toast.show(message, 'info');
            }
        },
        
        setupQuizTracking() {
            // Intercept quiz submissions
            document.addEventListener('quizAnswered', (e) => {
                if (e.detail && e.detail.isCorrect !== undefined) {
                    this.recordAnswer(e.detail.isCorrect);
                }
            });
        }
    };

    // ==========================================
    // FEATURE 6: ANTI-CHEATING SYSTEM
    // ==========================================
    
    const AntiCheat = {
        violations: 0,
        maxViolations: 3,
        isActive: false,
        
        init() {
            this.setupDetection();
        },
        
        setupDetection() {
            // Tab visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && this.isActive) {
                    this.handleViolation('Tab switched');
                }
            });
            
            // Window blur
            window.addEventListener('blur', () => {
                if (this.isActive) {
                    setTimeout(() => {
                        if (!document.hasFocus()) {
                            this.handleViolation('Window lost focus');
                        }
                    }, 500);
                }
            });
            
            // Copy/Paste detection
            document.addEventListener('copy', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    this.showWarning('Copying is not allowed during the test');
                }
            });
            
            document.addEventListener('paste', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    this.showWarning('Pasting is not allowed during the test');
                }
            });
            
            // Right-click disable
            document.addEventListener('contextmenu', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (this.isActive) {
                    // Disable F12, Ctrl+Shift+I, Ctrl+U
                    if (e.key === 'F12' || 
                        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                        (e.ctrlKey && e.key === 'u')) {
                        e.preventDefault();
                        this.showWarning('Developer tools are disabled during the test');
                    }
                }
            });
        },
        
        startMonitoring() {
            this.isActive = true;
            this.violations = 0;
        },
        
        stopMonitoring() {
            this.isActive = false;
        },
        
        handleViolation(reason) {
            this.violations++;
            
            if (this.violations >= this.maxViolations) {
                this.showWarning('Maximum violations reached! Test will be auto-submitted.', true);
                // Trigger auto-submit
                document.dispatchEvent(new CustomEvent('autoSubmitTest'));
                this.deductXP();
            } else {
                this.showWarning(`Warning ${this.violations}/${this.maxViolations}: ${reason}. Do not switch tabs!`);
            }
        },
        
        deductXP() {
            const user = JSON.parse(localStorage.getItem('neuroquest_user') || '{}');
            if (user && user.xp) {
                user.xp = Math.max(0, user.xp - 50);
                localStorage.setItem('neuroquest_user', JSON.stringify(user));
                if (typeof Toast !== 'undefined') {
                    Toast.show('50 XP deducted for violations', 'error');
                }
            }
        },
        
        showWarning(message, isSevere = false) {
            if (typeof Toast !== 'undefined') {
                Toast.show(message, isSevere ? 'error' : 'warning');
            } else {
                alert(message);
            }
        }
    };

    // ==========================================
    // FEATURE 7: DATABASE SYNC
    // ==========================================
    
    const DatabaseSync = {
        async syncUserData() {
            const token = localStorage.getItem('neuroquest_token');
            if (!token) return;
            
            try {
                // Get latest user data from server
                const response = await fetch('http://localhost:5000/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const data = await response.json();
                if (data.success) {
                    // Update local storage with server data
                    localStorage.setItem('neuroquest_user', JSON.stringify(data.user));
                    
                    // Sync progress
                    const progressRes = await fetch('http://localhost:5000/api/progress', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    const progressData = await progressRes.json();
                    if (progressData.success) {
                        localStorage.setItem('neuroquest_progress', JSON.stringify(progressData.data));
                    }
                }
            } catch (error) {
                console.error('Sync failed:', error);
            }
        },
        
        async saveProgress(courseData) {
            const token = localStorage.getItem('neuroquest_token');
            if (!token) return;
            
            try {
                const response = await fetch('http://localhost:5000/api/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(courseData)
                });
                
                return await response.json();
            } catch (error) {
                console.error('Save progress failed:', error);
                // Fallback to local storage
                this.saveProgressLocal(courseData);
            }
        },
        
        saveProgressLocal(courseData) {
            const progress = JSON.parse(localStorage.getItem('neuroquest_progress') || '[]');
            const existingIndex = progress.findIndex(p => p.course === courseData.course);
            
            if (existingIndex >= 0) {
                progress[existingIndex] = courseData;
            } else {
                progress.push(courseData);
            }
            
            localStorage.setItem('neuroquest_progress', JSON.stringify(progress));
        }
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    function init() {
        AuthPersistence.init();
        AdaptiveLearning.init();
        AntiCheat.init();
        DatabaseSync.syncUserData();
        
        // Expose to global scope
        window.NeuroQuestFeatures = {
            AuthPersistence,
            AdaptiveLearning,
            AntiCheat,
            DatabaseSync
        };
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();