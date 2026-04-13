// ==========================================
// USER DNA SYSTEM - ADVANCED INTELLIGENCE LAYER
// Creates unique, personalized, non-replicable experiences
// WITHOUT modifying existing UI/UX
// ==========================================

const UserDNASystem = {
    // Core user DNA profile
    dna: {
        profileType: null,
        accuracy: 0,
        speed: 0,
        subjectPreference: {},
        mistakePatterns: {},
        strengthAreas: [],
        weaknessAreas: [],
        responseTimeHistory: [],
        consistency: 0,
        adaptability: 0,
        engagement: 0
    },

    // Session tracking
    session: {
        startTime: Date.now(),
        questionsAnswered: 0,
        correctCount: 0,
        wrongCount: 0,
        avgResponseTime: 0,
        fastestResponse: Infinity,
        slowestResponse: 0,
        streaks: { current: 0, best: 0 },
        subjectPerformance: {},
        instability: 50, // 0-100
        neuralSync: 50   // 0-100
    },

    // Hidden progression system
    hiddenProgress: {
        tier: 1,
        hiddenXP: 0,
        secretRanks: ['INITIATE', 'OPERATOR', 'SPECIALIST', 'EXPERT', 'MASTER', 'LEGEND'],
        unlockedTiers: [1],
        multipliers: {
            accuracy: 1,
            speed: 1,
            streak: 1
        }
    },

    // System identity
    systemIdentity: {
        name: 'NEURAL CORE',
        protocol: 'PROTOCOL OMEGA',
        version: 'v9.2.1',
        status: 'ACTIVE'
    },

    // Configuration
    config: {
        dnaUpdateInterval: 5000,
        eventTriggerChance: 0.02,
        pressureThreshold: 10000, // 10 seconds
        historyEchoChance: 0.15
    },

    // User profile types
    profileTypes: {
        LOGICAL_THINKER: {
            name: 'Logical Thinker',
            traits: ['analytical', 'methodical', 'precise'],
            messages: [
                'You prefer logical patterns.',
                'Your analytical approach is detected.',
                'Methodical thinking pattern recognized.'
            ]
        },
        FAST_RESPONDER: {
            name: 'Fast Responder',
            traits: ['quick', 'intuitive', 'aggressive'],
            messages: [
                'You solve faster than 78% of users.',
                'Rapid response pattern detected.',
                'Your speed is exceptional.'
            ]
        },
        EXPLORER: {
            name: 'Explorer',
            traits: ['curious', 'diverse', 'experimental'],
            messages: [
                'You explore diverse subjects.',
                'Curiosity-driven pattern detected.',
                'Multi-domain interest recognized.'
            ]
        },
        STRUGGLER_ADAPTIVE: {
            name: 'Adaptive Learner',
            traits: ['persistent', 'growing', 'resilient'],
            messages: [
                'Support systems activated for you.',
                'Adaptive guidance engaged.',
                'Growth pattern detected. Keep going.'
            ]
        }
    },

    // Random events
    randomEvents: [
        {
            id: 'glitch_bonus',
            name: 'System Glitch',
            message: '⚠ System glitch detected — BONUS XP ROUND',
            effect: () => { UserDNASystem.hiddenProgress.multipliers.accuracy = 2; },
            duration: 60000
        },
        {
            id: 'challenge_override',
            name: 'Challenge Override',
            message: '🔥 CHALLENGE OVERRIDE ACTIVATED',
            effect: () => { UserDNASystem.session.neuralSync += 10; },
            duration: 30000
        },
        {
            id: 'time_compression',
            name: 'Time Compression',
            message: '⏱ TIME LIMIT REDUCED — Speed bonus active',
            effect: () => { UserDNASystem.hiddenProgress.multipliers.speed = 1.5; },
            duration: 45000
        },
        {
            id: 'deep_sync',
            name: 'Deep Sync',
            message: '🧠 DEEP NEURAL SYNC DETECTED',
            effect: () => { UserDNASystem.session.neuralSync += 15; },
            duration: 60000
        }
    ],

    // Question history for echo system
    questionHistory: {},

    // Initialize the DNA system
    init() {
        this.loadDNA();
        this.createUIElements();
        this.startDNALoop();
        this.attachEventHooks();
        this.analyzeInitialDNA();
        
        console.log('🧬 User DNA System: Initialized');
        console.log(`🧬 ${this.systemIdentity.name} ${this.systemIdentity.status}`);
    },

    // Load or create DNA profile
    loadDNA() {
        const saved = localStorage.getItem('userDNA');
        if (saved) {
            const data = JSON.parse(saved);
            this.dna = { ...this.dna, ...data.dna };
            this.hiddenProgress = { ...this.hiddenProgress, ...data.hiddenProgress };
            this.questionHistory = data.questionHistory || {};
            this.showSystemIdentity();
        } else {
            this.createNewDNA();
        }
    },

    // Save DNA profile
    saveDNA() {
        localStorage.setItem('userDNA', JSON.stringify({
            dna: this.dna,
            hiddenProgress: this.hiddenProgress,
            questionHistory: this.questionHistory,
            lastSave: Date.now()
        }));
    },

    // Create new DNA profile
    createNewDNA() {
        this.dna.profileType = this.determineInitialProfile();
        this.saveDNA();
        this.showNewUserMessage();
    },

    // Determine initial profile type
    determineInitialProfile() {
        const types = Object.keys(this.profileTypes);
        return types[Math.floor(Math.random() * types.length)];
    },

    // Show system identity on load
    showSystemIdentity() {
        setTimeout(() => {
            this.showFloatingMessage(
                `${this.systemIdentity.name} ${this.systemIdentity.status}`,
                3000,
                'system'
            );
        }, 2000);
    },

    // Show new user welcome
    showNewUserMessage() {
        setTimeout(() => {
            this.showFloatingMessage(
                `${this.systemIdentity.protocol} ENGAGED`,
                4000,
                'system'
            );
            setTimeout(() => {
                this.showFloatingMessage(
                    'Neural calibration in progress...',
                    3000,
                    'info'
                );
            }, 1000);
        }, 3000);
    },

    // Create UI overlay elements
    createUIElements() {
        const container = document.createElement('div');
        container.id = 'dna-system-layer';
        container.innerHTML = `
            <div id="dna-floating-messages"></div>
            <div id="dna-pressure-indicator"></div>
            <div id="dna-system-status"></div>
            <div id="dna-cinematic-overlay"></div>
        `;
        document.body.appendChild(container);
        this.addStyles();
    },

    // Add dynamic styles
    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            #dna-system-layer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }

            #dna-floating-messages {
                position: fixed;
                top: 80px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                align-items: flex-end;
            }

            .dna-float-message {
                font-family: 'Orbitron', monospace;
                font-size: 0.7rem;
                padding: 8px 14px;
                border-radius: 4px;
                animation: dnaFloatIn 0.4s ease, dnaFloatOut 0.4s ease 2.6s forwards;
                max-width: 280px;
                text-align: right;
                backdrop-filter: blur(4px);
            }

            .dna-float-message.system {
                color: var(--accent-cyan);
                background: rgba(0, 240, 255, 0.1);
                border: 1px solid var(--accent-cyan-dim);
                text-shadow: 0 0 10px var(--accent-cyan-dim);
            }

            .dna-float-message.info {
                color: var(--matrix-green);
                background: rgba(0, 255, 65, 0.1);
                border: 1px solid rgba(0, 255, 65, 0.3);
            }

            .dna-float-message.warning {
                color: var(--accent-yellow);
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid var(--accent-yellow-dim);
            }

            .dna-float-message.event {
                color: #ff6b6b;
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid rgba(255, 107, 107, 0.4);
                animation: dnaFloatIn 0.4s ease, dnaEventPulse 2s ease infinite alternate, dnaFloatOut 0.4s ease 4.6s forwards;
            }

            @keyframes dnaFloatIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            @keyframes dnaFloatOut {
                to { opacity: 0; transform: translateX(-10px); }
            }

            @keyframes dnaEventPulse {
                from { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
                to { box-shadow: 0 0 15px rgba(255, 107, 107, 0.6); }
            }

            #dna-system-status {
                position: fixed;
                bottom: 60px;
                right: 20px;
                font-family: 'Orbitron', monospace;
                font-size: 0.6rem;
                color: var(--accent-cyan);
                opacity: 0.4;
                text-align: right;
            }

            .dna-status-line {
                margin: 2px 0;
            }

            #dna-pressure-indicator {
                position: fixed;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                width: 3px;
                height: 100px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #dna-pressure-indicator.active {
                opacity: 0.6;
            }

            #dna-pressure-indicator::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(to top, var(--accent-red), var(--accent-yellow));
                border-radius: 2px;
                transition: height 0.3s ease;
            }

            #dna-cinematic-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                opacity: 0;
                z-index: 10000;
            }

            #dna-cinematic-overlay.active {
                animation: dnaCinematicFlash 0.3s ease;
            }

            @keyframes dnaCinematicFlash {
                0%, 100% { opacity: 0; }
                50% { 
                    opacity: 1;
                    background: rgba(0, 240, 255, 0.1);
                    backdrop-filter: invert(0.1) hue-rotate(180deg);
                }
            }

            .dna-micro-feedback {
                position: absolute;
                font-family: 'Orbitron', monospace;
                font-size: 0.6rem;
                color: var(--accent-cyan);
                opacity: 0;
                animation: dnaMicroFeedback 1.5s ease forwards;
                pointer-events: none;
                white-space: nowrap;
            }

            @keyframes dnaMicroFeedback {
                0% { opacity: 0; transform: translateY(0); }
                20% { opacity: 0.8; transform: translateY(-10px); }
                80% { opacity: 0.8; transform: translateY(-15px); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(styles);
    },

    // Start DNA analysis loop
    startDNALoop() {
        // Update DNA periodically
        setInterval(() => {
            this.updateDNAProfile();
            this.updateSystemStatus();
            this.checkRandomEvents();
        }, this.config.dnaUpdateInterval);

        // Check for pressure buildup
        setInterval(() => {
            this.checkPressureIndicator();
        }, 1000);
    },

    // Attach event hooks
    attachEventHooks() {
        // Hook into answer events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('choice-btn')) {
                this.recordInteraction(e.target);
            }
        });

        // Hook into mode changes
        const originalStartLearningMode = App.startLearningMode;
        App.startLearningMode = (mode) => {
            this.session.currentMode = mode;
            this.onModeStart(mode);
            return originalStartLearningMode.call(App, mode);
        };
    },

    // Record interaction for DNA analysis
    recordInteraction(element) {
        const now = Date.now();
        const responseTime = now - (this.lastQuestionTime || now);
        this.lastQuestionTime = now;

        const isCorrect = element.classList.contains('correct');
        
        // Update session stats
        this.session.questionsAnswered++;
        if (isCorrect) {
            this.session.correctCount++;
            this.session.streaks.current++;
            this.session.streaks.best = Math.max(this.session.streaks.best, this.session.streaks.current);
            this.session.neuralSync = Math.min(100, this.session.neuralSync + 3);
            this.session.instability = Math.max(0, this.session.instability - 2);
        } else {
            this.session.wrongCount++;
            this.session.streaks.current = 0;
            this.session.instability = Math.min(100, this.session.instability + 5);
            this.session.neuralSync = Math.max(0, this.session.neuralSync - 2);
        }

        // Update response time tracking
        this.session.responseTimeHistory.push(responseTime);
        if (this.session.responseTimeHistory.length > 10) {
            this.session.responseTimeHistory.shift();
        }
        this.session.avgResponseTime = this.session.responseTimeHistory.reduce((a, b) => a + b, 0) / this.session.responseTimeHistory.length;
        this.session.fastestResponse = Math.min(this.session.fastestResponse, responseTime);
        this.session.slowestResponse = Math.max(this.session.slowestResponse, responseTime);

        // Show real-time feedback
        this.showRealTimeFeedback(isCorrect, responseTime);

        // Update DNA
        this.updateDNAFromInteraction(isCorrect, responseTime);

        // Check for history echo
        this.checkHistoryEcho();

        // Save
        this.saveDNA();
    },

    // Show real-time performance feedback
    showRealTimeFeedback(isCorrect, responseTime) {
        // Speed feedback
        if (responseTime < 3000) {
            this.showMicroFeedback('Fast answer', 'speed');
        } else if (responseTime > 8000) {
            this.showMicroFeedback('Slow response detected', 'warning');
        }

        // Streak feedback
        if (this.session.streaks.current >= 3) {
            this.showMicroFeedback(`${this.session.streaks.current}x STREAK`, 'streak');
        }

        // Accuracy feedback
        const accuracy = this.session.correctCount / this.session.questionsAnswered;
        if (this.session.questionsAnswered > 5 && accuracy < 0.5) {
            this.showMicroFeedback('Accuracy dropping', 'warning');
        }
    },

    // Show micro feedback near cursor
    showMicroFeedback(text, type) {
        const feedback = document.createElement('div');
        feedback.className = 'dna-micro-feedback';
        feedback.textContent = text;
        feedback.style.color = type === 'warning' ? 'var(--accent-yellow)' : 
                               type === 'streak' ? 'var(--matrix-green)' : 'var(--accent-cyan)';
        
        // Position near last click or center
        feedback.style.left = '50%';
        feedback.style.top = '40%';
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    },

    // Update DNA from interaction
    updateDNAFromInteraction(isCorrect, responseTime) {
        // Update accuracy
        this.dna.accuracy = this.session.correctCount / this.session.questionsAnswered;

        // Update speed score (lower is better, max 10 seconds)
        this.dna.speed = Math.max(0, 100 - (this.session.avgResponseTime / 100));

        // Determine profile type based on data
        if (this.session.questionsAnswered >= 5) {
            this.determineProfileType();
        }

        // Update consistency
        if (this.session.responseTimeHistory.length >= 5) {
            const variance = this.calculateVariance(this.session.responseTimeHistory);
            this.dna.consistency = Math.max(0, 100 - (variance / 1000));
        }
    },

    // Calculate variance for consistency
    calculateVariance(arr) {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    },

    // Determine user profile type
    determineProfileType() {
        const speed = this.dna.speed;
        const accuracy = this.dna.accuracy;
        const consistency = this.dna.consistency;

        if (speed > 70 && accuracy > 0.7) {
            this.dna.profileType = 'FAST_RESPONDER';
        } else if (accuracy > 0.8 && consistency > 70) {
            this.dna.profileType = 'LOGICAL_THINKER';
        } else if (accuracy < 0.5) {
            this.dna.profileType = 'STRUGGLER_ADAPTIVE';
        } else {
            this.dna.profileType = 'EXPLORER';
        }
    },

    // Check for history echo
    checkHistoryEcho() {
        if (Math.random() > this.config.historyEchoChance) return;

        const accuracy = this.dna.accuracy;
        const prevAccuracy = this.dna.previousAccuracy || accuracy;

        if (accuracy > prevAccuracy && this.session.questionsAnswered > 3) {
            this.showFloatingMessage('Improvement from last attempt.', 3000, 'info');
        }

        this.dna.previousAccuracy = accuracy;
    },

    // Update DNA profile periodically
    updateDNAProfile() {
        // Show profile-specific messages occasionally
        if (Math.random() > 0.7 && this.dna.profileType) {
            const profile = this.profileTypes[this.dna.profileType];
            if (profile && profile.messages) {
                const msg = profile.messages[Math.floor(Math.random() * profile.messages.length)];
                this.showFloatingMessage(msg, 4000, 'info');
            }
        }

        // Check for hidden tier unlock
        this.checkHiddenTierUnlock();
    },

    // Check for hidden tier unlock
    checkHiddenTierUnlock() {
        const questionsNeeded = this.hiddenProgress.tier * 15;
        
        if (this.session.questionsAnswered >= questionsNeeded && 
            !this.hiddenProgress.unlockedTiers.includes(this.hiddenProgress.tier + 1)) {
            
            this.hiddenProgress.tier++;
            this.hiddenProgress.unlockedTiers.push(this.hiddenProgress.tier);
            
            const rank = this.hiddenProgress.secretRanks[this.hiddenProgress.tier - 1] || 'UNKNOWN';
            this.showFloatingMessage(
                `🔓 HIDDEN TIER UNLOCKED: ${rank}`,
                5000,
                'event'
            );

            // Cinematic moment
            this.triggerCinematicFlash();
        }
    },

    // Trigger cinematic flash
    triggerCinematicFlash() {
        const overlay = document.getElementById('dna-cinematic-overlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => overlay.classList.remove('active'), 300);
        }
    },

    // Check for random events
    checkRandomEvents() {
        if (Math.random() > this.config.eventTriggerChance) return;

        const event = this.randomEvents[Math.floor(Math.random() * this.randomEvents.length)];
        this.triggerRandomEvent(event);
    },

    // Trigger random event
    triggerRandomEvent(event) {
        this.showFloatingMessage(event.message, 5000, 'event');
        event.effect();
        
        // Reset effect after duration
        setTimeout(() => {
            this.hiddenProgress.multipliers.accuracy = 1;
            this.hiddenProgress.multipliers.speed = 1;
        }, event.duration);
    },

    // Check pressure indicator
    checkPressureIndicator() {
        const indicator = document.getElementById('dna-pressure-indicator');
        if (!indicator) return;

        const timeSinceActivity = Date.now() - (this.lastQuestionTime || Date.now());
        const pressureLevel = Math.min(100, (timeSinceActivity / this.config.pressureThreshold) * 100);

        if (pressureLevel > 30) {
            indicator.classList.add('active');
            indicator.style.setProperty('--pressure-height', `${pressureLevel}%`);
            
            const after = indicator.querySelector('::after') || indicator;
            after.style.height = `${pressureLevel}%`;

            if (pressureLevel > 70 && Math.random() > 0.8) {
                this.showFloatingMessage('Decision delay detected...', 2500, 'warning');
            }
        } else {
            indicator.classList.remove('active');
        }
    },

    // Update system status display
    updateSystemStatus() {
        const status = document.getElementById('dna-system-status');
        if (!status) return;

        status.innerHTML = `
            <div class="dna-status-line">${this.systemIdentity.name} ${this.systemIdentity.version}</div>
            <div class="dna-status-line">Sync: ${Math.round(this.session.neuralSync)}%</div>
            <div class="dna-status-line">Stability: ${Math.round(100 - this.session.instability)}%</div>
            ${this.hiddenProgress.tier > 1 ? `<div class="dna-status-line">Tier: ${this.hiddenProgress.secretRanks[this.hiddenProgress.tier - 1]}</div>` : ''}
        `;
    },

    // On mode start
    onModeStart(mode) {
        // Show mode-specific message
        const messages = {
            dungeon: 'Entering simulation environment...',
            battle: 'Combat mode initialized.',
            practice: 'Training protocol engaged.'
        };

        if (messages[mode]) {
            this.showFloatingMessage(messages[mode], 3000, 'system');
        }

        // Show recommendation if available
        if (this.dna.weaknessAreas.length > 0 && Math.random() > 0.5) {
            const weakSubject = this.dna.weaknessAreas[0];
            this.showFloatingMessage(
                `Recommendation: Focus on ${weakSubject}`,
                4000,
                'info'
            );
        }
    },

    // Show floating message
    showFloatingMessage(text, duration = 3000, type = 'info') {
        const container = document.getElementById('dna-floating-messages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = `dna-float-message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);

        setTimeout(() => msg.remove(), duration + 400);
    },

    // Analyze initial DNA
    analyzeInitialDNA() {
        // Show initial analysis after delay
        setTimeout(() => {
            if (this.dna.profileType) {
                const profile = this.profileTypes[this.dna.profileType];
                this.showFloatingMessage(
                    `Profile: ${profile.name}`,
                    4000,
                    'system'
                );
            }
        }, 5000);
    },

    // Public API for external integration
    getDNAReport() {
        return {
            profile: this.dna.profileType,
            accuracy: Math.round(this.dna.accuracy * 100),
            speed: Math.round(this.dna.speed),
            tier: this.hiddenProgress.secretRanks[this.hiddenProgress.tier - 1],
            sync: Math.round(this.session.neuralSync)
        };
    },

    onDashboardLoad() {
        // Personalized greeting
        const greetings = [
            'Back again?',
            'Improvement detected.',
            'Neural link stable.',
            `Welcome back, ${this.dna.profileType ? this.profileTypes[this.dna.profileType].name : 'User'}.`
        ];

        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.showFloatingMessage(greeting, 3000, 'info');

        // Show session evolution
        if (this.session.questionsAnswered > 10) {
            const improvement = Math.round((this.dna.accuracy - 0.5) * 100);
            if (improvement > 0) {
                this.showFloatingMessage(
                    `Performance improved by ${improvement}%`,
                    4000,
                    'info'
                );
            }
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => UserDNASystem.init(), 1500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserDNASystem;
}
