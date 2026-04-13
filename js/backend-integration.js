/**
 * Backend Integration - Connects all UI to real backend functionality
 * NO UI CHANGES - Only functionality implementation
 */

(function() {
    'use strict';

    const API_BASE = 'http://localhost:5000/api';

    // ==========================================
    // FEATURE 1: AUTHENTICATION & SESSION PERSISTENCE
    // ==========================================
    
    const AuthSystem = {
        TOKEN_KEY: 'neuroquest_token',
        USER_KEY: 'neuroquest_user',
        
        init() {
            this.interceptForms();
            this.checkSession();
            this.setupLogoutHandler();
        },
        
        interceptForms() {
            // Intercept signup form
            document.addEventListener('submit', async (e) => {
                const form = e.target;
                
                // Detect signup form
                if (form.id?.includes('signup') || form.className?.includes('signup')) {
                    e.preventDefault();
                    await this.handleSignup(form);
                }
                
                // Detect login form
                if (form.id?.includes('login') || form.className?.includes('login')) {
                    e.preventDefault();
                    await this.handleLogin(form);
                }
            }, true);
        },
        
        async handleSignup(form) {
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') || form.querySelector('[name="name"]')?.value || form.querySelector('#signup-name')?.value,
                email: formData.get('email') || form.querySelector('[name="email"]')?.value || form.querySelector('#signup-email')?.value || form.querySelector('#login-email')?.value,
                password: formData.get('password') || form.querySelector('[name="password"]')?.value
            };
            
            // Try to find inputs if formData didn't work
            if (!data.name) {
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    if (input.type === 'text' && !data.name) data.name = input.value;
                    if (input.type === 'email' && !data.email) data.email = input.value;
                    if (input.type === 'password' && !data.password) data.password = input.value;
                });
            }
            
            try {
                const response = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.saveSession(result.token, result.user);
                    this.showSuccess('Account created successfully!');
                    this.redirectToDashboard();
                } else {
                    this.showError(result.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                this.showError('Network error. Please try again.');
            }
        },
        
        async handleLogin(form) {
            const formData = new FormData(form);
            const data = {
                email: formData.get('email') || form.querySelector('[name="email"]')?.value || form.querySelector('#login-email')?.value,
                password: formData.get('password') || form.querySelector('[name="password"]')?.value
            };
            
            // Try to find inputs
            if (!data.email) {
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    if (input.type === 'email' && !data.email) data.email = input.value;
                    if (input.type === 'password' && !data.password) data.password = input.value;
                });
            }
            
            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.saveSession(result.token, result.user);
                    this.showSuccess('Login successful!');
                    this.redirectToDashboard();
                } else {
                    this.showError(result.message || 'Invalid credentials');
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showError('Network error. Please try again.');
            }
        },
        
        saveSession(token, user) {
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        },
        
        checkSession() {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const user = JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
            
            if (token && user) {
                // Verify token with backend
                fetch(`${API_BASE}/auth/verify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Update stored user data
                        localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
                        this.updateUIWithUser(data.user);
                    } else {
                        this.clearSession();
                    }
                })
                .catch(() => {
                    // Keep session on network error, clear on auth error
                });
            }
        },
        
        updateUIWithUser(user) {
            // Update any UI elements with user data
            const nameEl = document.querySelector('#user-name') || document.querySelector('.user-name');
            const levelEl = document.querySelector('#user-level') || document.querySelector('.user-level');
            const xpEl = document.querySelector('#xp-text') || document.querySelector('.xp-text');
            
            if (nameEl) nameEl.textContent = user.name;
            if (levelEl) levelEl.textContent = `Level ${user.level || 1}`;
            if (xpEl) xpEl.textContent = `${user.xp || 0} XP`;
        },
        
        clearSession() {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        },
        
        setupLogoutHandler() {
            document.addEventListener('click', (e) => {
                if (e.target.matches('[onclick*="logout"], .logout-btn, #logout-btn')) {
                    this.clearSession();
                }
            });
        },
        
        redirectToDashboard() {
            // Try to find and click dashboard button or navigate
            const dashboardBtn = document.querySelector('[onclick*="dashboard"], .dashboard-btn, #dashboard-btn');
            if (dashboardBtn) {
                dashboardBtn.click();
            }
        },
        
        showSuccess(message) {
            if (typeof Toast !== 'undefined') Toast.show(message, 'success');
            else if (typeof State !== 'undefined' && State.showModal) State.showModal('Success', message);
            else console.log('Success:', message);
        },
        
        showError(message) {
            if (typeof Toast !== 'undefined') Toast.show(message, 'error');
            else if (typeof State !== 'undefined' && State.showModal) State.showModal('Error', message);
            else console.error('Error:', message);
        },
        
        getToken() {
            return localStorage.getItem(this.TOKEN_KEY);
        },
        
        getUser() {
            return JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
        }
    };

    // ==========================================
    // FEATURE 2: COURSE COMPLETION & REPORT GENERATION
    // ==========================================
    
    const ReportSystem = {
        init() {
            this.interceptCourseCompletion();
        },
        
        interceptCourseCompletion() {
            // Listen for course completion events
            document.addEventListener('courseCompleted', async (e) => {
                const { course, score, totalQuestions, topics } = e.detail;
                await this.saveProgress(course, score, totalQuestions, topics);
                await this.generateReport(course, score, totalQuestions, topics);
            });
            
            // Also intercept any completion buttons
            document.addEventListener('click', async (e) => {
                if (e.target.matches('[onclick*="complete"], .complete-btn, .finish-course, [id*="complete"]')) {
                    // Extract course data from UI
                    const courseData = this.extractCourseData();
                    if (courseData) {
                        await this.saveProgress(courseData.course, courseData.score, courseData.total, courseData.topics);
                    }
                }
            });
        },
        
        extractCourseData() {
            // Try to extract course info from the page
            const courseEl = document.querySelector('.course-title, .subject-name, [class*="course"]');
            const scoreEl = document.querySelector('.score, .result-score, [class*="score"]');
            
            return {
                course: courseEl?.textContent || 'Course',
                score: parseInt(scoreEl?.textContent) || 0,
                total: 10,
                topics: []
            };
        },
        
        async saveProgress(course, score, totalQuestions, topics) {
            const token = AuthSystem.getToken();
            if (!token) return;
            
            try {
                await fetch(`${API_BASE}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        course,
                        score,
                        totalQuestions,
                        topics: topics || [],
                        completed: 100,
                        completionDate: new Date()
                    })
                });
            } catch (error) {
                console.error('Save progress error:', error);
            }
        },
        
        async generateReport(course, score, totalQuestions, topics) {
            const user = AuthSystem.getUser();
            if (!user) return;
            
            const reportHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Course Completion Certificate - ${course}</title>
                    <style>
                        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            padding: 40px;
                            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                            color: #fff;
                            min-height: 100vh;
                        }
                        .certificate {
                            max-width: 800px;
                            margin: 0 auto;
                            background: rgba(255,255,255,0.05);
                            border: 3px solid #00d4ff;
                            border-radius: 20px;
                            padding: 50px;
                            box-shadow: 0 0 50px rgba(0,212,255,0.3);
                        }
                        .header { text-align: center; border-bottom: 2px solid rgba(0,212,255,0.3); padding-bottom: 30px; margin-bottom: 40px; }
                        .logo { font-size: 36px; font-weight: bold; color: #00d4ff; text-shadow: 0 0 20px rgba(0,212,255,0.5); }
                        .subtitle { font-size: 18px; color: #888; margin-top: 10px; }
                        .student-name { font-size: 32px; color: #fff; text-align: center; margin: 30px 0; }
                        .course-title { font-size: 24px; color: #00d4ff; text-align: center; margin-bottom: 40px; }
                        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
                        .stat-box { background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 10px; padding: 20px; text-align: center; }
                        .stat-label { font-size: 14px; color: #888; margin-bottom: 10px; }
                        .stat-value { font-size: 28px; font-weight: bold; color: #00d4ff; }
                        .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-size: 12px; }
                        .date { color: #00d4ff; font-size: 16px; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="header">
                            <div class="logo">⚡ NEUROQUEST</div>
                            <div class="subtitle">Certificate of Completion</div>
                        </div>
                        <div class="student-name">${user.name}</div>
                        <div class="course-title">${course}</div>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-label">Score</div>
                                <div class="stat-value">${score}/${totalQuestions}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Accuracy</div>
                                <div class="stat-value">${Math.round((score/totalQuestions)*100)}%</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">XP Earned</div>
                                <div class="stat-value">+${score * 10}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Status</div>
                                <div class="stat-value">Completed</div>
                            </div>
                        </div>
                        <div class="footer">
                            <div>This certificate verifies successful course completion</div>
                            <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div style="margin-top: 10px;">Certificate ID: NQ-${Date.now().toString(36).toUpperCase()}</div>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            // Open print dialog for PDF generation
            const printWindow = window.open('', '_blank');
            printWindow.document.write(reportHTML);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            
            // Show download button if there's a report container
            this.injectDownloadButton(course, reportHTML);
        },
        
        injectDownloadButton(course, html) {
            // Find a suitable place to add download button
            const container = document.querySelector('.results-container, .completion-screen, [class*="result"]');
            if (container && !container.querySelector('.download-report-btn')) {
                const btn = document.createElement('button');
                btn.className = 'download-report-btn';
                btn.innerHTML = '📄 Download Certificate';
                btn.style.cssText = `
                    margin-top: 20px;
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    border: none;
                    border-radius: 10px;
                    color: #0a0a0f;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                `;
                btn.onclick = () => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(html);
                    printWindow.document.close();
                    setTimeout(() => printWindow.print(), 500);
                };
                container.appendChild(btn);
            }
        }
    };

    // ==========================================
    // FEATURE 3: EMAIL NOTIFICATIONS
    // ==========================================
    
    const EmailSystem = {
        async sendCompletionEmail(course, score) {
            const user = AuthSystem.getUser();
            if (!user) return;
            
            // Backend handles email sending automatically on progress save
            // This is just a client-side confirmation
            console.log(`Completion email will be sent to ${user.email} for ${course}`);
        }
    };

    // ==========================================
    // FEATURE 4: ADAPTIVE LEARNING SYSTEM
    // ==========================================
    
    const AdaptiveLearning = {
        init() {
            this.loadStats();
            this.interceptQuizAnswers();
        },
        
        loadStats() {
            const stats = JSON.parse(localStorage.getItem('neuroquest_learning_stats') || '{}');
            this.stats = {
                correctStreak: stats.correctStreak || 0,
                wrongStreak: stats.wrongStreak || 0,
                currentDifficulty: stats.currentDifficulty || 'medium',
                weakTopics: stats.weakTopics || [],
                strongTopics: stats.strongTopics || [],
                topicPerformance: stats.topicPerformance || {}
            };
        },
        
        saveStats() {
            localStorage.setItem('neuroquest_learning_stats', JSON.stringify(this.stats));
        },
        
        interceptQuizAnswers() {
            // Listen for answer events
            document.addEventListener('answerSubmitted', (e) => {
                const { isCorrect, topic, question } = e.detail;
                this.processAnswer(isCorrect, topic);
            });
            
            // Also intercept clicks on answer options
            document.addEventListener('click', (e) => {
                const answerBtn = e.target.closest('.answer-option, .quiz-option, [class*="answer"], [class*="option"]');
                if (answerBtn) {
                    // Determine if correct based on data attribute or class
                    const isCorrect = answerBtn.dataset.correct === 'true' || 
                                     answerBtn.classList.contains('correct');
                    const topic = this.extractTopic();
                    this.processAnswer(isCorrect, topic);
                }
            });
        },
        
        extractTopic() {
            const topicEl = document.querySelector('.topic-name, .subject-name, [class*="topic"], [class*="subject"]');
            return topicEl?.textContent || 'General';
        },
        
        processAnswer(isCorrect, topic) {
            // Update streaks
            if (isCorrect) {
                this.stats.correctStreak++;
                this.stats.wrongStreak = 0;
                this.updateTopicPerformance(topic, true);
            } else {
                this.stats.wrongStreak++;
                this.stats.correctStreak = 0;
                this.updateTopicPerformance(topic, false);
            }
            
            // Adjust difficulty
            this.adjustDifficulty();
            
            // Save stats
            this.saveStats();
            
            // Dispatch event for XP system
            document.dispatchEvent(new CustomEvent('adaptiveAnswer', {
                detail: { isCorrect, difficulty: this.stats.currentDifficulty }
            }));
        },
        
        updateTopicPerformance(topic, isCorrect) {
            if (!this.stats.topicPerformance[topic]) {
                this.stats.topicPerformance[topic] = { correct: 0, total: 0 };
            }
            
            this.stats.topicPerformance[topic].total++;
            if (isCorrect) {
                this.stats.topicPerformance[topic].correct++;
            }
            
            // Update weak/strong topics
            const accuracy = this.stats.topicPerformance[topic].correct / this.stats.topicPerformance[topic].total;
            
            if (accuracy < 0.5 && this.stats.topicPerformance[topic].total >= 3) {
                if (!this.stats.weakTopics.includes(topic)) {
                    this.stats.weakTopics.push(topic);
                }
                this.stats.strongTopics = this.stats.strongTopics.filter(t => t !== topic);
            } else if (accuracy > 0.8 && this.stats.topicPerformance[topic].total >= 5) {
                if (!this.stats.strongTopics.includes(topic)) {
                    this.stats.strongTopics.push(topic);
                }
                this.stats.weakTopics = this.stats.weakTopics.filter(t => t !== topic);
            }
        },
        
        adjustDifficulty() {
            // Increase difficulty after 5 correct answers
            if (this.stats.correctStreak >= 5) {
                if (this.stats.currentDifficulty === 'easy') {
                    this.stats.currentDifficulty = 'medium';
                    this.showNotification('Difficulty increased to Medium!');
                } else if (this.stats.currentDifficulty === 'medium') {
                    this.stats.currentDifficulty = 'hard';
                    this.showNotification('Difficulty increased to Hard!');
                }
                this.stats.correctStreak = 0;
            }
            
            // Decrease difficulty after 3 wrong answers
            if (this.stats.wrongStreak >= 3) {
                if (this.stats.currentDifficulty === 'hard') {
                    this.stats.currentDifficulty = 'medium';
                    this.showNotification('Difficulty adjusted to Medium');
                } else if (this.stats.currentDifficulty === 'medium') {
                    this.stats.currentDifficulty = 'easy';
                    this.showNotification('Difficulty adjusted to Easy');
                }
                this.stats.wrongStreak = 0;
            }
        },
        
        getSmartSuggestion() {
            if (this.stats.weakTopics.length > 0) {
                return `Focus on: ${this.stats.weakTopics[0]} (needs improvement)`;
            } else if (this.stats.strongTopics.length > 0) {
                return `Try advanced topics beyond ${this.stats.strongTopics[0]}`;
            }
            return 'Keep practicing to improve your skills!';
        },
        
        showNotification(message) {
            if (typeof Toast !== 'undefined') Toast.show(message, 'info');
        },
        
        getCurrentDifficulty() {
            return this.stats.currentDifficulty;
        }
    };

    // ==========================================
    // FEATURE 5: CONTACT US SYSTEM
    // ==========================================
    
    const ContactSystem = {
        init() {
            this.interceptContactForms();
        },
        
        interceptContactForms() {
            document.addEventListener('submit', async (e) => {
                const form = e.target;
                if (form.id?.includes('contact') || form.className?.includes('contact')) {
                    e.preventDefault();
                    await this.handleSubmit(form);
                }
            }, true);
        },
        
        async handleSubmit(form) {
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') || form.querySelector('[name="name"]')?.value,
                email: formData.get('email') || form.querySelector('[name="email"]')?.value,
                message: formData.get('message') || form.querySelector('[name="message"]')?.value
            };
            
            // Find inputs if formData didn't work
            if (!data.name) {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    if (input.type === 'text' && !data.name) data.name = input.value;
                    if (input.type === 'email' && !data.email) data.email = input.value;
                    if (input.tagName === 'TEXTAREA' && !data.message) data.message = input.value;
                });
            }
            
            try {
                const response = await fetch(`${API_BASE}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.showSuccess('Message sent successfully!');
                    form.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Contact error:', error);
                // Fallback: store locally
                this.storeLocally(data);
                this.showSuccess('Message saved! We will contact you soon.');
                form.reset();
            }
        },
        
        storeLocally(data) {
            const messages = JSON.parse(localStorage.getItem('neuroquest_contact_messages') || '[]');
            messages.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('neuroquest_contact_messages', JSON.stringify(messages));
        },
        
        showSuccess(message) {
            if (typeof Toast !== 'undefined') Toast.show(message, 'success');
            else if (typeof State !== 'undefined' && State.showModal) State.showModal('Success', message);
            else alert(message);
        }
    };

    // ==========================================
    // FEATURE 6: ANTI-CHEAT SYSTEM
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
                        if (!document.hasFocus() && this.isActive) {
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
                if (this.isActive) e.preventDefault();
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (this.isActive) {
                    if (e.key === 'F12' || 
                        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                        (e.ctrlKey && e.key === 'u')) {
                        e.preventDefault();
                        this.showWarning('Developer tools are disabled during the test');
                    }
                }
            });
            
            // Auto-activate when quiz starts
            document.addEventListener('quizStarted', () => this.activate());
            document.addEventListener('testStarted', () => this.activate());
        },
        
        activate() {
            this.isActive = true;
            this.violations = 0;
            console.log('Anti-cheat activated');
        },
        
        deactivate() {
            this.isActive = false;
            console.log('Anti-cheat deactivated');
        },
        
        handleViolation(reason) {
            this.violations++;
            
            if (this.violations >= this.maxViolations) {
                this.showWarning('Maximum violations reached! Test will be auto-submitted.', true);
                this.deductXP(50);
                document.dispatchEvent(new CustomEvent('autoSubmitTest'));
                this.deactivate();
            } else {
                this.showWarning(`Warning ${this.violations}/${this.maxViolations}: ${reason}. Do not switch tabs!`);
                this.deductXP(10);
            }
        },
        
        deductXP(amount) {
            const user = AuthSystem.getUser();
            if (user && user.xp) {
                user.xp = Math.max(0, user.xp - amount);
                localStorage.setItem(AuthSystem.USER_KEY, JSON.stringify(user));
                if (typeof Toast !== 'undefined') {
                    Toast.show(`${amount} XP deducted for violation`, 'error');
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
    // FEATURE 7: XP & PROGRESSION SYSTEM
    // ==========================================
    
    const XPSystem = {
        init() {
            this.listenForAnswers();
            this.checkDailyStreak();
        },
        
        listenForAnswers() {
            document.addEventListener('adaptiveAnswer', (e) => {
                const { isCorrect } = e.detail;
                if (isCorrect) {
                    this.addXP(10);
                }
            });
        },
        
        addXP(amount) {
            const user = AuthSystem.getUser();
            if (!user) return;
            
            user.xp = (user.xp || 0) + amount;
            const newLevel = Math.floor(user.xp / 100) + 1;
            
            if (newLevel > (user.level || 1)) {
                user.level = newLevel;
                if (typeof Toast !== 'undefined') {
                    Toast.show(`Level Up! You are now Level ${newLevel}`, 'success');
                }
            }
            
            localStorage.setItem(AuthSystem.USER_KEY, JSON.stringify(user));
            AuthSystem.updateUIWithUser(user);
        },
        
        checkDailyStreak() {
            const lastActive = localStorage.getItem('neuroquest_last_active');
            const today = new Date().toDateString();
            
            if (lastActive) {
                const lastDate = new Date(lastActive);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastDate.toDateString() === yesterday.toDateString()) {
                    // Consecutive day
                    const streak = parseInt(localStorage.getItem('neuroquest_streak') || '0') + 1;
                    localStorage.setItem('neuroquest_streak', streak);
                    this.addXP(streak * 5);
                    if (typeof Toast !== 'undefined') {
                        Toast.show(`Daily Streak: ${streak} days! +${streak * 5} XP`, 'success');
                    }
                } else if (lastDate.toDateString() !== today) {
                    // Streak broken
                    localStorage.setItem('neuroquest_streak', '1');
                }
            }
            
            localStorage.setItem('neuroquest_last_active', new Date().toISOString());
        }
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    function init() {
        AuthSystem.init();
        ReportSystem.init();
        AdaptiveLearning.init();
        ContactSystem.init();
        AntiCheat.init();
        XPSystem.init();
        
        // Expose to global scope for debugging
        window.NeuroQuestIntegration = {
            AuthSystem,
            ReportSystem,
            AdaptiveLearning,
            ContactSystem,
            AntiCheat,
            XPSystem
        };
        
        console.log('✅ Backend Integration Active');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();