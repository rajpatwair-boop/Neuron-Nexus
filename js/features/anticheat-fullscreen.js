/**
 * Anti-Cheat System with Fullscreen Enforcement
 * Prevents cheating during MCQ tests with real penalties
 */

(function() {
    'use strict';

    const AntiCheatFullscreen = {
        isActive: false,
        violations: 0,
        maxViolations: 3,
        originalTitle: document.title,
        testActive: false,
        fullscreenCheckInterval: null,
        
        // State control flags to prevent popup loops
        violationActive: false,
        lastViolationTime: 0,
        violationCooldown: 5000, // 5 seconds cooldown (increased to prevent loop)
        violationRecoveryPending: false, // Tracks if we're recovering from violation
        
        // Fullscreen state control
        fullscreenRequested: false,
        fullscreenChangeListener: null,
        
        CONFIG: {
            warning1: '⚠️ Warning 1: Do not switch tabs. XP will be deducted.',
            warning2: '⚠️ Warning 2: Final warning. Next violation will penalize you.',
            warning3: '❌ You violated test rules. XP deducted.',
            xpPenalty: 50,
            fullscreenRequired: true
        },

        init() {
            this.setupEventListeners();
            this.detectTestMode();
            console.log('🛡️ Anti-Cheat Fullscreen System initialized');
        },

        setupEventListeners() {
            // Tab visibility change
            document.addEventListener('visibilitychange', () => {
                if (this.isActive && document.hidden) {
                    this.handleViolation('Tab switched');
                }
            });

            // Window blur - app switch detection
            window.addEventListener('blur', () => {
                if (this.isActive) {
                    setTimeout(() => {
                        if (this.isActive && !document.hasFocus()) {
                            this.handleViolation('Window lost focus');
                        }
                    }, 200);
                }
            });

            // Fullscreen change detection
            document.addEventListener('fullscreenchange', () => {
                if (this.isActive && !document.fullscreenElement) {
                    this.handleViolation('Fullscreen exited');
                }
            });

            // Prevent context menu
            document.addEventListener('contextmenu', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    return false;
                }
            });

            // Prevent copy/paste/cut
            ['copy', 'paste', 'cut'].forEach(event => {
                document.addEventListener(event, (e) => {
                    if (this.isActive) {
                        e.preventDefault();
                        return false;
                    }
                });
            });

            // Prevent text selection
            document.addEventListener('selectstart', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    return false;
                }
            });

            // Block keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (!this.isActive) return;

                // Block F12
                if (e.key === 'F12') {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+Shift+I (DevTools)
                if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+U (View Source)
                if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+T (New Tab)
                if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+W (Close Tab)
                if (e.ctrlKey && (e.key === 'w' || e.key === 'W')) {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+Tab (Next Tab)
                if (e.ctrlKey && e.key === 'Tab') {
                    e.preventDefault();
                    return false;
                }

                // Block Alt+Tab (App Switch) - limited but try
                if (e.altKey && e.key === 'Tab') {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+C (Copy)
                if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    return false;
                }

                // Block Ctrl+V (Paste)
                if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                    e.preventDefault();
                    return false;
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
                const hasQuiz = document.querySelector('.quiz-container, .question-container, [class*="quiz"], [class*="test"], [class*="mcq"], #battle-screen');
                const urlHasQuiz = url.includes('quiz') || url.includes('test') || url.includes('battle');
                
                if ((hasQuiz || urlHasQuiz) && !this.isActive) {
                    // Show fullscreen modal first (user must click to activate)
                    this.showFullscreenRequiredModal();
                } else if (!hasQuiz && !urlHasQuiz && this.isActive) {
                    this.endTest();
                }
            };

            setInterval(checkMode, 500);
        },

        async startTest() {
            if (this.isActive) return;
            
            console.log('🛡️ Starting anti-cheat protection...');
            
            // Activate anti-cheat
            this.isActive = true;
            this.violations = 0;
            this.testActive = true;
            this.originalTitle = document.title;
            document.title = '🔒 TEST IN PROGRESS - DO NOT SWITCH TABS';
            
            // Reset fullscreen request flag
            this.fullscreenRequested = false;
            
            // Start fullscreen monitoring
            this.startFullscreenMonitoring();
            
            // Add anti-cheat styles
            this.addAntiCheatStyles();
            
            console.log('🛡️ Anti-cheat: ACTIVE');
        },

        async requestFullscreen() {
            // Check if already in fullscreen
            if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                console.log('🛡️ Already in fullscreen');
                return true;
            }
            
            // Check if already requested (prevent multiple clicks)
            if (this.fullscreenRequested) {
                console.log('🛡️ Fullscreen already requested, waiting...');
                return false;
            }
            
            this.fullscreenRequested = true;
            
            try {
                const elem = document.documentElement;
                let promise = null;
                
                if (elem.requestFullscreen) {
                    promise = elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    promise = elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    promise = elem.msRequestFullscreen();
                }
                
                if (promise) {
                    await promise;
                    console.log('🛡️ Fullscreen granted');
                    return true;
                }
            } catch (error) {
                console.log('🛡️ Fullscreen request failed:', error.message);
                this.fullscreenRequested = false; // Reset on failure
            }
            
            return false;
        },

        showFullscreenRequiredModal() {
            const existing = document.getElementById('fullscreen-required-modal');
            if (existing) return;

            const modal = document.createElement('div');
            modal.id = 'fullscreen-required-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
            `;

            modal.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
                    border: 2px solid #ff4444;
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 400px;
                    text-align: center;
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                    <h2 style="color: #ff4444; margin: 0 0 15px;">Fullscreen Required</h2>
                    <p style="color: #888; margin: 0 0 25px; line-height: 1.6;">
                        Please enable fullscreen mode to continue with the test.
                        This prevents cheating and ensures fair assessment.
                    </p>
                    <button id="enable-fullscreen-btn" style="
                        background: linear-gradient(135deg, #00d4ff, #0099cc);
                        border: none;
                        border-radius: 8px;
                        color: #0a0a0f;
                        padding: 15px 30px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                    ">Enter Fullscreen</button>
                    <div id="fullscreen-error" style="
                        display: none;
                        color: #ff4444;
                        margin-top: 15px;
                        font-size: 14px;
                    ">Please allow fullscreen access and try again</div>
                </div>
            `;

            document.body.appendChild(modal);

            // Setup fullscreen change listener
            this.setupFullscreenChangeListener(modal);

            // Button click handler - single execution
            const btn = document.getElementById('enable-fullscreen-btn');
            btn.onclick = async () => {
                // Disable button to prevent multiple clicks
                btn.disabled = true;
                btn.style.opacity = '0.6';
                btn.textContent = 'Requesting...';
                
                const granted = await this.requestFullscreen();
                
                if (!granted) {
                    // Show error if not granted
                    document.getElementById('fullscreen-error').style.display = 'block';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.textContent = 'Enter Fullscreen';
                    this.fullscreenRequested = false; // Allow retry
                }
                // If granted, the fullscreenchange event will handle the rest
            };
        },

        setupFullscreenChangeListener(modal) {
            // Remove any existing listener
            if (this.fullscreenChangeListener) {
                document.removeEventListener('fullscreenchange', this.fullscreenChangeListener);
                document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeListener);
            }
            
            // Create new listener
            this.fullscreenChangeListener = () => {
                const isFullscreen = document.fullscreenElement || 
                                    document.webkitFullscreenElement || 
                                    document.msFullscreenElement;
                
                if (isFullscreen && modal.parentElement) {
                    console.log('🛡️ Fullscreen activated, removing modal');
                    modal.remove();
                    this.fullscreenRequested = false;
                    this.startTest();
                }
            };
            
            // Listen for fullscreen change
            document.addEventListener('fullscreenchange', this.fullscreenChangeListener);
            document.addEventListener('webkitfullscreenchange', this.fullscreenChangeListener);
        },

        startFullscreenMonitoring() {
            // Clear any existing interval first
            if (this.fullscreenCheckInterval) {
                clearInterval(this.fullscreenCheckInterval);
            }
            
            this.fullscreenCheckInterval = setInterval(() => {
                // Only trigger if not already handling a violation
                if (this.isActive && !document.fullscreenElement && !this.violationActive) {
                    this.handleViolation('Fullscreen exited');
                }
            }, 2000); // Increased to 2 seconds to reduce frequency
        },

        handleViolation(reason) {
            if (!this.isActive) return;
            
            // Check if violation is already being handled (prevents popup loop)
            if (this.violationActive) {
                console.log('🛡️ Violation already being handled, ignoring duplicate');
                return;
            }
            
            // Check if we're in recovery mode (after OK clicked)
            if (this.violationRecoveryPending) {
                console.log('🛡️ Violation recovery in progress, ignoring');
                return;
            }
            
            // Check cooldown period
            const now = Date.now();
            if (now - this.lastViolationTime < this.violationCooldown) {
                console.log('🛡️ Violation in cooldown period, ignoring');
                return;
            }
            
            // Set violation lock flag
            this.violationActive = true;
            this.lastViolationTime = now;
            
            this.violations++;
            console.log(`🛡️ Violation ${this.violations}/${this.maxViolations}: ${reason}`);

            let message = '';
            
            if (this.violations === 1) {
                message = this.CONFIG.warning1;
                this.showWarningPopup(message);
            } else if (this.violations === 2) {
                message = this.CONFIG.warning2;
                this.showWarningPopup(message);
            } else if (this.violations >= 3) {
                message = this.CONFIG.warning3;
                this.showWarningPopup(message);
                this.deductXP(this.CONFIG.xpPenalty);
            }
        },

        deductXP(amount) {
            try {
                const userStr = localStorage.getItem('neuroquest_user_data');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.xp !== undefined) {
                        const originalXP = user.xp;
                        user.xp = Math.max(0, user.xp - amount);
                        localStorage.setItem('neuroquest_user_data', JSON.stringify(user));
                        
                        // Update UI
                        document.querySelectorAll('#xp-text, .xp-text, .user-xp').forEach(el => {
                            el.textContent = `${user.xp} XP`;
                        });
                        
                        console.log(`🛡️ XP Deducted: ${originalXP} → ${user.xp} (-${amount})`);
                        
                        // Show deduction notification
                        this.showNotification(`❌ ${amount} XP DEDUCTED for cheating!`, 'error');
                    }
                }
            } catch (error) {
                console.error('XP deduction error:', error);
            }
        },

        showWarningPopup(message) {
            const existing = document.getElementById('anticheat-warning-popup');
            if (existing) {
                // Don't create duplicate popup if one exists
                return;
            }

            const warning = document.createElement('div');
            warning.id = 'anticheat-warning-popup';
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
                animation: warningPulse 0.5s ease;
            `;
            warning.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                <div>${message}</div>
                <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Click OK to return to fullscreen</div>
                <button id="anticheat-ok-btn" style="
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
            
            // Handle OK button click - recover to fullscreen
            const handleOk = async () => {
                warning.remove();
                console.log('🛡️ User acknowledged warning, starting recovery');
                
                // Set recovery mode to prevent immediate re-trigger
                this.violationRecoveryPending = true;
                this.violationActive = false;
                this.fullscreenRequested = false;
                
                // Small delay before requesting fullscreen
                await new Promise(r => setTimeout(r, 300));
                
                // Request fullscreen
                const granted = await this.requestFullscreen();
                
                if (granted) {
                    console.log('🛡️ Fullscreen restored after violation');
                } else {
                    // If fullscreen failed, show the fullscreen modal
                    console.log('🛡️ Fullscreen restore failed, showing modal');
                    this.showFullscreenRequiredModal();
                }
                
                // Keep recovery mode for cooldown period, then release
                setTimeout(() => {
                    this.violationRecoveryPending = false;
                    console.log('🛡️ Violation recovery complete, monitoring resumed');
                }, this.violationCooldown);
            };
            
            document.getElementById('anticheat-ok-btn').onclick = handleOk;
            
            // Auto-remove after 10 seconds with recovery (longer to give user time)
            setTimeout(() => {
                if (warning.parentElement) {
                    handleOk();
                }
            }, 10000);
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
                font-weight: 600;
                z-index: 999999;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            notif.textContent = message;
            document.body.appendChild(notif);
            
            setTimeout(() => {
                notif.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }, 4000);
        },

        addAntiCheatStyles() {
            if (document.getElementById('anticheat-fullscreen-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'anticheat-fullscreen-styles';
            style.textContent = `
                @keyframes warningPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                body.anticheat-active {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                }
            `;
            document.head.appendChild(style);
            
            document.body.classList.add('anticheat-active');
        },

        endTest() {
            if (!this.isActive) return;
            
            this.isActive = false;
            this.testActive = false;
            this.violationActive = false; // Reset violation lock
            this.violationRecoveryPending = false; // Reset recovery flag
            this.lastViolationTime = 0;
            this.fullscreenRequested = false;
            document.title = this.originalTitle;
            
            // Clear monitoring
            if (this.fullscreenCheckInterval) {
                clearInterval(this.fullscreenCheckInterval);
                this.fullscreenCheckInterval = null;
            }
            
            // Remove fullscreen change listener
            if (this.fullscreenChangeListener) {
                document.removeEventListener('fullscreenchange', this.fullscreenChangeListener);
                document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeListener);
                this.fullscreenChangeListener = null;
            }
            
            // Exit fullscreen
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
            
            // Remove styles
            document.body.classList.remove('anticheat-active');
            
            // Remove any modals
            document.getElementById('fullscreen-required-modal')?.remove();
            document.getElementById('anticheat-warning-popup')?.remove();
            
            console.log('🛡️ Anti-cheat: DEACTIVATED - Test ended');
        }
    };

    window.AntiCheatFullscreen = AntiCheatFullscreen;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AntiCheatFullscreen.init());
    } else {
        AntiCheatFullscreen.init();
    }
})();