/**
 * Anti-Cheat System for MCQ Mode
 * Detects and prevents cheating during tests
 */

(function() {
    'use strict';

    const AntiCheatSystem = {
        isActive: false,
        violations: 0,
        maxViolations: 3,
        originalTitle: document.title,
        blurTimeout: null,
        
        CONFIG: {
            warningMessage: '⚠️ Do not switch tabs. You will lose XP.',
            terminateMessage: 'Test terminated due to suspicious activity',
            xpDeductFirst: 10,
            xpDeductRepeat: 25
        },

        init() {
            this.setupEventListeners();
            this.injectStyles();
            this.detectTestMode();
            console.log('🛡️ Anti-Cheat System initialized');
        },

        setupEventListeners() {
            // Tab visibility change
            document.addEventListener('visibilitychange', () => {
                if (this.isActive && document.hidden) {
                    this.handleViolation('Tab switched');
                }
            });

            // Window blur
            window.addEventListener('blur', () => {
                if (this.isActive) {
                    this.blurTimeout = setTimeout(() => {
                        if (this.isActive && !document.hasFocus()) {
                            this.handleViolation('Window lost focus');
                        }
                    }, 500);
                }
            });

            window.addEventListener('focus', () => {
                if (this.blurTimeout) {
                    clearTimeout(this.blurTimeout);
                    this.blurTimeout = null;
                }
            });

            // Right-click disable
            document.addEventListener('contextmenu', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    this.showWarning('Right-click is disabled during the test');
                }
            });

            // Copy/Paste/Cut prevention
            ['copy', 'paste', 'cut'].forEach(event => {
                document.addEventListener(event, (e) => {
                    if (this.isActive) {
                        e.preventDefault();
                        if (event !== 'cut') {
                            this.showWarning(`${event.charAt(0).toUpperCase() + event.slice(1)} is not allowed during the test`);
                        }
                    }
                });
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (!this.isActive) return;

                if (e.key === 'F12') {
                    e.preventDefault();
                    this.showWarning('Developer tools are disabled during the test');
                    return;
                }

                if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                    e.preventDefault();
                    this.showWarning('Developer tools are disabled during the test');
                    return;
                }

                if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                    e.preventDefault();
                    this.showWarning('View source is disabled during the test');
                    return;
                }

                if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
                    e.preventDefault();
                    this.showWarning('Opening new tabs is not allowed');
                    return;
                }

                if (e.ctrlKey && (e.key === 'w' || e.key === 'W')) {
                    e.preventDefault();
                    this.showWarning('Closing the tab is not allowed during the test');
                    return;
                }
            });

            // Before unload warning
            window.addEventListener('beforeunload', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    e.returnValue = 'Test is in progress. Are you sure you want to leave?';
                    return e.returnValue;
                }
            });
        },

        detectTestMode() {
            const checkMode = () => {
                const url = window.location.href;
                const hasQuiz = document.querySelector('.quiz-container, .question-container, [class*="quiz"], [class*="test"], [class*="mcq"]');
                const urlHasQuiz = url.includes('quiz') || url.includes('test') || url.includes('battle');
                
                if ((hasQuiz || urlHasQuiz) && !this.isActive) {
                    setTimeout(() => this.activate(), 1000);
                } else if (!hasQuiz && !urlHasQuiz && this.isActive) {
                    this.deactivate();
                }
            };

            setInterval(checkMode, 1000);
        },

        activate() {
            if (this.isActive) return;
            
            this.isActive = true;
            this.violations = 0;
            this.originalTitle = document.title;
            document.title = '🔒 TEST IN PROGRESS - ' + this.originalTitle;
            
            console.log('🛡️ Anti-Cheat: ACTIVATED');
            this.showNotification('🔒 Focus Mode Activated', 'info');
        },

        deactivate() {
            if (!this.isActive) return;
            
            this.isActive = false;
            document.title = this.originalTitle;
            
            if (this.blurTimeout) {
                clearTimeout(this.blurTimeout);
                this.blurTimeout = null;
            }
            
            console.log('🛡️ Anti-Cheat: DEACTIVATED');
        },

        handleViolation(reason) {
            this.violations++;
            console.log(`🛡️ Violation ${this.violations}/${this.maxViolations}: ${reason}`);

            if (this.violations === 1) {
                this.deductXP(this.CONFIG.xpDeductFirst);
                this.showWarningPopup(this.CONFIG.warningMessage);
                this.showNotification(`⚠️ Warning: ${reason}`, 'warning');
            } else if (this.violations >= this.maxViolations) {
                this.deductXP(this.CONFIG.xpDeductRepeat);
                this.terminateTest();
            } else {
                this.deductXP(this.CONFIG.xpDeductRepeat);
                this.showWarningPopup(`⚠️ Warning ${this.violations}/${this.maxViolations}: ${reason}`);
                this.showNotification(`⚠️ Violation ${this.violations}`, 'error');
            }
        },

        deductXP(amount) {
            try {
                const userStr = localStorage.getItem('neuroquest_user_data');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.xp) {
                        user.xp = Math.max(0, user.xp - amount);
                        localStorage.setItem('neuroquest_user_data', JSON.stringify(user));
                        
                        document.querySelectorAll('#xp-text, .xp-text, .user-xp').forEach(el => {
                            el.textContent = `${user.xp} XP`;
                        });
                    }
                }
            } catch (error) {
                console.error('XP deduction error:', error);
            }
        },

        terminateTest() {
            this.deactivate();
            this.showTerminationScreen();
            
            document.dispatchEvent(new CustomEvent('testTerminated', {
                detail: { reason: 'multiple_violations', violations: this.violations }
            }));
            
            console.log('🛡️ Test terminated due to violations');
        },

        showWarningPopup(message) {
            const existing = document.getElementById('anticheat-warning');
            if (existing) existing.remove();

            const warning = document.createElement('div');
            warning.id = 'anticheat-warning';
            warning.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff4444, #cc0000);
                color: #fff;
                padding: 30px 40px;
                border-radius: 16px;
                font-size: 18px;
                font-weight: 600;
                text-align: center;
                z-index: 999999;
                box-shadow: 0 10px 50px rgba(255, 68, 68, 0.5);
            `;
            warning.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                <div>${message.replace(/\n/g, '<br>')}</div>
                <button onclick="this.parentElement.remove()" style="
                    margin-top: 20px;
                    padding: 10px 30px;
                    background: #fff;
                    color: #ff4444;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">OK</button>
            `;

            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), 5000);
        },

        showTerminationScreen() {
            const screen = document.createElement('div');
            screen.id = 'anticheat-termination';
            screen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.98);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                color: #fff;
                text-align: center;
            `;
            screen.innerHTML = `
                <div style="font-size: 80px; margin-bottom: 30px;">🚫</div>
                <h1 style="color: #ff4444; font-size: 32px; margin-bottom: 20px;">Test Terminated</h1>
                <p style="font-size: 18px; color: #888; max-width: 500px; line-height: 1.6;">
                    ${this.CONFIG.terminateMessage}<br><br>
                    Multiple tab switches were detected.
                </p>
                <button onclick="window.location.reload()" style="
                    margin-top: 40px;
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    border: none;
                    border-radius: 8px;
                    color: #0a0a0f;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Return to Dashboard</button>
            `;

            document.body.appendChild(screen);
        },

        showNotification(message, type) {
            const colors = { info: '#00d4ff', warning: '#ffaa00', error: '#ff4444' };
            
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(10, 10, 15, 0.95);
                border: 2px solid ${colors[type]};
                color: #fff;
                padding: 15px 20px;
                border-radius: 10px;
                font-size: 14px;
                z-index: 999999;
                max-width: 300px;
            `;
            notif.textContent = message;
            document.body.appendChild(notif);
            
            setTimeout(() => notif.remove(), 4000);
        },

        showWarning(msg) {
            this.showNotification(msg, 'warning');
        },

        injectStyles() {
            if (document.getElementById('anticheat-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'anticheat-styles';
            style.textContent = `
                @keyframes warningPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    window.AntiCheatSystem = AntiCheatSystem;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AntiCheatSystem.init());
    } else {
        AntiCheatSystem.init();
    }
})();