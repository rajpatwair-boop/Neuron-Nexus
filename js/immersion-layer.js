// ==========================================
// IMMERSIVE AI SYSTEM LAYER
// Adds psychological, interactive, and atmospheric features
// WITHOUT modifying existing UI/UX
// ==========================================

const ImmersionLayer = {
    // System state tracking
    state: {
        correctStreak: 0,
        wrongStreak: 0,
        totalAnswered: 0,
        correctCount: 0,
        sessionStartTime: Date.now(),
        lastActivityTime: Date.now(),
        isIdle: false,
        neuralSyncComplete: false,
        currentMode: null,
        userName: null
    },

    // Configuration
    config: {
        messageInterval: 25000, // System messages every 25 seconds
        idleThreshold: 30000,   // 30 seconds for idle detection
        glowIntensity: 0.15,
        flickerChance: 0.03
    },

    // System Personality Messages
    systemMessages: {
        analyzing: [
            'Analyzing your behavior...',
            'Pattern detected.',
            'Processing response data...',
            'Neural pathway mapping...',
            'Cognitive load assessment...'
        ],
        correct: [
            'Pattern recognition improving.',
            'Neural sync stabilizing...',
            'Efficiency increasing.',
            'Optimal performance detected.',
            'Synaptic connection strengthened.'
        ],
        wrong: [
            'Recalibrating difficulty...',
            'Analyzing error pattern...',
            'Neural adjustment required.',
            'Re-routing cognitive path...',
            'Stabilizing knowledge base...'
        ],
        streak: [
            'Exceptional performance.',
            'Neural acceleration detected.',
            'Entering flow state...',
            'Cognitive enhancement active.',
            'Mastery level approaching...'
        ],
        idle: [
            'System waiting...',
            'Input required...',
            'Neural link dormant...',
            'Awaiting user response...',
            'Connection stable. Standing by...'
        ]
    },

    // Micro Story / Passive Lore
    loreMessages: [
        'User 023 failed calibration...',
        'Neural sync unstable in sector 7...',
        'Memory banks operating at 94%...',
        'Previous subject: TERMINATED...',
        'Core temperature: Nominal...',
        'Quantum processors: Online...',
        'Warning: Unauthorized access attempt blocked...',
        'Backup systems: Active...',
        'Subject retention rate: 87%...',
        'Neural pathway integrity: Stable...',
        'Scanning for anomalies...',
        'Deep learning models: Updating...',
        'Previous session data: Archived...',
        'System consciousness: Dormant...',
        'Encrypted transmission received...'
    ],

    // Mode-specific personalities
    modePersonalities: {
        dungeon: {
            messages: [
                'The system watches...',
                'Darkness approaches...',
                'Mystery deepens...',
                'Unknown variables detected...',
                'Reality distortion minor...'
            ],
            tone: 'mysterious'
        },
        battle: {
            messages: [
                'Opponent analyzing...',
                'Competitive edge detected...',
                'Victory probability rising...',
                'Combat mode: Engaged...',
                'Dominance pattern forming...'
            ],
            tone: 'aggressive'
        },
        practice: {
            messages: [
                'Learning curve optimal...',
                'Knowledge absorption: High...',
                'Skill development: On track...',
                'Guidance systems: Active...',
                'Progress tracking: Enabled...'
            ],
            tone: 'supportive'
        }
    },

    // Session memory variations
    welcomeBackMessages: [
        'Neural link re-established...',
        'Welcome back, operator.',
        'Previous session restored.',
        'Resuming cognitive training...',
        'Sync complete. Continuing...'
    ],

    // Initialize the immersion layer
    init() {
        this.loadSessionData();
        this.createOverlayElements();
        this.startSystemMessageLoop();
        this.startIdleDetection();
        this.startBackgroundPulse();
        this.attachEventHooks();
        this.checkNeuralSyncMoment();
        
        console.log('🧠 Immersion Layer: Activated');
    },

    // Load or generate session data
    loadSessionData() {
        const saved = sessionStorage.getItem('neuralSession');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.correctStreak = data.correctStreak || 0;
            this.state.totalAnswered = data.totalAnswered || 0;
            this.state.correctCount = data.correctCount || 0;
            this.state.neuralSyncComplete = data.neuralSyncComplete || false;
            this.showWelcomeBack();
        }
        
        // Get user name from State if available
        if (typeof State !== 'undefined' && State.user) {
            this.state.userName = State.user.name;
        }
    },

    // Save session data
    saveSessionData() {
        sessionStorage.setItem('neuralSession', JSON.stringify({
            correctStreak: this.state.correctStreak,
            totalAnswered: this.state.totalAnswered,
            correctCount: this.state.correctCount,
            neuralSyncComplete: this.state.neuralSyncComplete
        }));
    },

    // Create overlay elements for effects
    createOverlayElements() {
        // System message container
        const msgContainer = document.createElement('div');
        msgContainer.id = 'system-message-layer';
        msgContainer.className = 'system-message-layer';
        document.body.appendChild(msgContainer);

        // Environment reaction overlay
        const reactionOverlay = document.createElement('div');
        reactionOverlay.id = 'reaction-overlay';
        reactionOverlay.className = 'reaction-overlay';
        document.body.appendChild(reactionOverlay);

        // Hover tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'hover-intelligence';
        tooltip.className = 'hover-intelligence';
        document.body.appendChild(tooltip);

        // Add CSS styles
        this.addStyles();
    },

    // Add dynamic styles
    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* System Message Layer */
            .system-message-layer {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9999;
                font-family: 'Orbitron', monospace;
                font-size: 0.75rem;
                color: var(--accent-cyan);
                opacity: 0.6;
                pointer-events: none;
                text-shadow: 0 0 10px var(--accent-cyan-dim);
            }

            .system-message {
                animation: systemMessageFade 4s ease forwards;
                margin-bottom: 5px;
            }

            @keyframes systemMessageFade {
                0% { opacity: 0; transform: translateX(-10px); }
                15% { opacity: 0.8; transform: translateX(0); }
                85% { opacity: 0.8; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(10px); }
            }

            /* Reaction Overlay */
            .reaction-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .reaction-overlay.correct-glow {
                background: radial-gradient(circle at center, rgba(0, 255, 65, 0.1) 0%, transparent 70%);
                animation: correctGlow 0.8s ease forwards;
            }

            .reaction-overlay.wrong-flicker {
                background: rgba(255, 59, 59, 0.15);
                animation: wrongFlicker 0.4s ease forwards;
            }

            @keyframes correctGlow {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }

            @keyframes wrongFlicker {
                0%, 100% { opacity: 0; }
                25%, 75% { opacity: 1; }
                50% { opacity: 0.3; }
            }

            /* Hover Intelligence Tooltip */
            .hover-intelligence {
                position: fixed;
                z-index: 10000;
                font-family: 'Orbitron', monospace;
                font-size: 0.65rem;
                color: var(--accent-cyan);
                background: rgba(10, 10, 15, 0.9);
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid var(--accent-cyan-dim);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .hover-intelligence.visible {
                opacity: 0.9;
            }

            /* Neural Sync Glitch Effect */
            .neural-sync-glitch {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                pointer-events: none;
                animation: neuralSyncGlitch 2s ease forwards;
            }

            @keyframes neuralSyncGlitch {
                0% { 
                    background: rgba(0, 240, 255, 0);
                    backdrop-filter: none;
                }
                10%, 30%, 50%, 70%, 90% {
                    background: rgba(0, 240, 255, 0.05);
                    backdrop-filter: hue-rotate(90deg) saturate(1.5);
                }
                20%, 40%, 60%, 80% {
                    background: rgba(255, 0, 64, 0.03);
                    backdrop-filter: hue-rotate(-90deg);
                }
                100% { 
                    background: rgba(0, 240, 255, 0);
                    backdrop-filter: none;
                }
            }

            .neural-sync-text {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'Orbitron', monospace;
                font-size: 2rem;
                color: var(--accent-cyan);
                text-shadow: 0 0 30px var(--accent-cyan), 0 0 60px var(--accent-cyan-dim);
                z-index: 10002;
                animation: neuralSyncText 2s ease forwards;
                text-align: center;
            }

            @keyframes neuralSyncText {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                30% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
            }

            /* Background Pulse Animation */
            @keyframes backgroundPulse {
                0%, 100% { opacity: 0.05; }
                50% { opacity: 0.1; }
            }

            /* Streak Glow Enhancement */
            .streak-glow {
                animation: streakGlow 1s ease infinite alternate;
            }

            @keyframes streakGlow {
                from { box-shadow: 0 0 20px var(--accent-cyan-dim); }
                to { box-shadow: 0 0 40px var(--accent-cyan), 0 0 60px var(--accent-cyan-dim); }
            }
        `;
        document.head.appendChild(styles);
    },

    // Show welcome back message
    showWelcomeBack() {
        const msg = this.getRandomMessage(this.welcomeBackMessages);
        this.showSystemMessage(msg, 4000);
    },

    // Start system message loop
    startSystemMessageLoop() {
        setInterval(() => {
            if (!this.state.isIdle && Math.random() > 0.6) {
                this.showRandomSystemMessage();
            }
        }, this.config.messageInterval);
    },

    // Show random system message based on state
    showRandomSystemMessage() {
        let messages;
        
        if (this.state.correctStreak >= 3) {
            messages = this.systemMessages.streak;
        } else if (this.state.wrongStreak >= 2) {
            messages = this.systemMessages.wrong;
        } else {
            messages = this.systemMessages.analyzing;
        }

        // Add mode-specific messages occasionally
        if (this.state.currentMode && Math.random() > 0.7) {
            const modePersonality = this.modePersonalities[this.state.currentMode];
            if (modePersonality) {
                messages = [...messages, ...modePersonality.messages];
            }
        }

        // Add lore messages rarely
        if (Math.random() > 0.92) {
            messages = this.loreMessages;
        }

        const msg = this.getRandomMessage(messages);
        this.showSystemMessage(msg);
    },

    // Show system message
    showSystemMessage(text, duration = 3500) {
        const container = document.getElementById('system-message-layer');
        if (!container) return;

        const msgEl = document.createElement('div');
        msgEl.className = 'system-message';
        msgEl.textContent = `> ${text}`;
        container.appendChild(msgEl);

        setTimeout(() => {
            msgEl.remove();
        }, duration);
    },

    // Get random message from array
    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    },

    // Start idle detection
    startIdleDetection() {
        // Update last activity on user interaction
        ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.state.lastActivityTime = Date.now();
                if (this.state.isIdle) {
                    this.state.isIdle = false;
                    this.showSystemMessage('Neural link restored...');
                }
            }, { passive: true });
        });

        // Check for idle state
        setInterval(() => {
            const idleTime = Date.now() - this.state.lastActivityTime;
            if (idleTime > this.config.idleThreshold && !this.state.isIdle) {
                this.state.isIdle = true;
                this.showSystemMessage(this.getRandomMessage(this.systemMessages.idle), 6000);
            }
        }, 5000);
    },

    // Start background pulse effects
    startBackgroundPulse() {
        // Occasional subtle flicker in neural lines
        setInterval(() => {
            if (Math.random() < this.config.flickerChance) {
                this.triggerBackgroundFlicker();
            }
        }, 3000);
    },

    // Trigger background flicker
    triggerBackgroundFlicker() {
        const neuralLines = document.querySelector('.neural-lines');
        if (neuralLines) {
            neuralLines.style.animation = 'backgroundPulse 0.5s ease';
            setTimeout(() => {
                neuralLines.style.animation = '';
            }, 500);
        }
    },

    // Attach event hooks for reactions
    attachEventHooks() {
        // Hook into answer selection
        this.originalHandleAnswer = null;
        
        // Monitor for answer events via mutation observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    this.checkForAnswerFeedback();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Add hover intelligence
        this.attachHoverIntelligence();
    },

    // Check for answer feedback in DOM
    checkForAnswerFeedback() {
        const correctBtn = document.querySelector('.choice-btn.correct');
        const wrongBtn = document.querySelector('.choice-btn.wrong');

        if (correctBtn && !correctBtn.dataset.immersionTriggered) {
            correctBtn.dataset.immersionTriggered = 'true';
            this.onCorrectAnswer();
        }

        if (wrongBtn && !wrongBtn.dataset.immersionTriggered) {
            wrongBtn.dataset.immersionTriggered = 'true';
            this.onWrongAnswer();
        }
    },

    // Handle correct answer reaction
    onCorrectAnswer() {
        this.state.correctStreak++;
        this.state.wrongStreak = 0;
        this.state.correctCount++;
        this.state.totalAnswered++;
        this.saveSessionData();

        // Show system message
        if (this.state.correctStreak >= 3) {
            this.showSystemMessage(this.getRandomMessage(this.systemMessages.streak));
        } else {
            this.showSystemMessage(this.getRandomMessage(this.systemMessages.correct));
        }

        // Visual feedback
        this.triggerCorrectGlow();

        // Audio hook
        this.triggerAudioHook('correct');

        // Check for neural sync moment
        this.checkNeuralSyncMoment();
    },

    // Handle wrong answer reaction
    onWrongAnswer() {
        this.state.wrongStreak++;
        this.state.correctStreak = 0;
        this.state.totalAnswered++;
        this.saveSessionData();

        // Show system message
        this.showSystemMessage(this.getRandomMessage(this.systemMessages.wrong));

        // Visual feedback
        this.triggerWrongFlicker();

        // Audio hook
        this.triggerAudioHook('wrong');
    },

    // Trigger correct answer glow
    triggerCorrectGlow() {
        const overlay = document.getElementById('reaction-overlay');
        if (overlay) {
            overlay.classList.remove('correct-glow');
            void overlay.offsetWidth; // Force reflow
            overlay.classList.add('correct-glow');
            
            // Enhance glow based on streak
            if (this.state.correctStreak >= 3) {
                document.body.classList.add('streak-glow');
                setTimeout(() => {
                    document.body.classList.remove('streak-glow');
                }, 2000);
            }
        }
    },

    // Trigger wrong answer flicker
    triggerWrongFlicker() {
        const overlay = document.getElementById('reaction-overlay');
        if (overlay) {
            overlay.classList.remove('wrong-flicker');
            void overlay.offsetWidth; // Force reflow
            overlay.classList.add('wrong-flicker');
        }
    },

    // Attach hover intelligence
    attachHoverIntelligence() {
        const tooltip = document.getElementById('hover-intelligence');
        if (!tooltip) return;

        const hoverTexts = {
            '.mode-card': ['Select to continue', 'Begin simulation', 'Enter mode'],
            '.selection-card': ['Select option', 'Confirm choice', 'Choose path'],
            '.cta-primary': ['Execute command', 'Initialize', 'Proceed'],
            '.choice-btn': ['Select answer', 'Confirm response', 'Submit']
        };

        Object.entries(hoverTexts).forEach(([selector, texts]) => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', (e) => {
                    const text = texts[Math.floor(Math.random() * texts.length)];
                    tooltip.textContent = text;
                    tooltip.classList.add('visible');
                    
                    const rect = el.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                    tooltip.style.top = `${rect.top - 25}px`;
                });

                el.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
            });
        });
    },

    // Check and trigger neural sync moment
    checkNeuralSyncMoment() {
        if (this.state.neuralSyncComplete) return;
        
        // Trigger after 5 correct answers or 8 total interactions
        if (this.state.correctCount >= 5 || this.state.totalAnswered >= 8) {
            this.triggerNeuralSyncMoment();
        }
    },

    // Trigger the signature neural sync moment
    triggerNeuralSyncMoment() {
        this.state.neuralSyncComplete = true;
        this.saveSessionData();

        // Create glitch overlay
        const glitch = document.createElement('div');
        glitch.className = 'neural-sync-glitch';
        document.body.appendChild(glitch);

        // Create text
        const text = document.createElement('div');
        text.className = 'neural-sync-text';
        text.innerHTML = 'NEURAL SYNC COMPLETE.<br><span style="font-size: 0.5em; opacity: 0.7;">SYSTEM OPTIMAL</span>';
        document.body.appendChild(text);

        // Audio hook
        this.triggerAudioHook('sync');

        // Clean up
        setTimeout(() => {
            glitch.remove();
            text.remove();
        }, 2500);

        // Show follow-up message
        setTimeout(() => {
            this.showSystemMessage('Neural synchronization achieved. Welcome to the network.', 5000);
        }, 2800);
    },

    // Set current mode for personality adaptation
    setMode(mode) {
        this.state.currentMode = mode;
        
        // Show mode-specific entry message
        const personality = this.modePersonalities[mode];
        if (personality && personality.messages) {
            const msg = this.getRandomMessage(personality.messages);
            setTimeout(() => this.showSystemMessage(msg), 1000);
        }
    },

    // Trigger audio hook (for future sound implementation)
    triggerAudioHook(eventType) {
        // Dispatch custom event for audio system
        const event = new CustomEvent('neuralAudio', { 
            detail: { type: eventType, timestamp: Date.now() } 
        });
        document.dispatchEvent(event);
        
        // Log for debugging
        console.log(`🔊 Audio Hook: ${eventType}`);
    },

    // Public API for external integration
    onLevelUp() {
        this.showSystemMessage('Cognitive enhancement detected. Level increased.', 4000);
        this.triggerAudioHook('levelup');
        
        // Visual ring expansion
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            border: 2px solid var(--accent-cyan);
            border-radius: 50%;
            z-index: 9997;
            pointer-events: none;
            animation: levelUpRing 1.5s ease forwards;
        `;
        document.body.appendChild(ring);
        
        setTimeout(() => ring.remove(), 1500);
    },

    onXPGain(amount) {
        if (amount >= 20) {
            this.showSystemMessage(`+${amount} XP. Neural pathway strengthened.`, 2500);
        }
    }
};

// Add level up ring animation
const levelUpStyle = document.createElement('style');
levelUpStyle.textContent = `
    @keyframes levelUpRing {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
    }
`;
document.head.appendChild(levelUpStyle);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to let main app load first
    setTimeout(() => ImmersionLayer.init(), 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImmersionLayer;
}
