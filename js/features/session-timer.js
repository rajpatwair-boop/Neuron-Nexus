/**
 * Creative Session Timer
 * Neon waveform style timer
 * Isolated component - does not modify existing code
 */

(function() {
    'use strict';

    let startTime = null;
    let timerInterval = null;
    let elapsedSeconds = 0;

    const STORAGE_KEY = 'neuroquest-session-start';

    function init() {
        // Restore or start new session
        const savedStart = localStorage.getItem(STORAGE_KEY);
        if (savedStart) {
            startTime = parseInt(savedStart);
            elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        } else {
            startTime = Date.now();
            localStorage.setItem(STORAGE_KEY, startTime);
        }

        createTimerUI();
        startTimer();
    }

    function createTimerUI() {
        const timer = document.createElement('div');
        timer.id = 'session-timer';
        timer.innerHTML = `
            <div class="timer-waveform">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
            </div>
            <div class="timer-display">
                <span id="timer-hours">00</span>:<span id="timer-minutes">00</span>:<span id="timer-seconds">00</span>
            </div>
        `;

        // Add to dashboard header or body
        const header = document.querySelector('.dashboard-header, .header-top');
        if (header) {
            header.insertBefore(timer, header.firstChild);
        } else {
            document.body.appendChild(timer);
        }

        addStyles();
    }

    function addStyles() {
        const style = document.createElement('style');
        style.id = 'session-timer-styles';
        style.textContent = `
            #session-timer {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 16px;
                background: rgba(0, 212, 255, 0.08);
                border: 1px solid rgba(0, 212, 255, 0.2);
                border-radius: 20px;
                position: fixed;
                top: 80px;
                right: 160px;
                z-index: 2;
            }

            .timer-waveform {
                display: flex;
                align-items: flex-end;
                gap: 3px;
                height: 20px;
            }

            .wave-bar {
                width: 3px;
                background: linear-gradient(to top, var(--accent-cyan, #00d4ff), transparent);
                border-radius: 2px;
                animation: waveform 1.2s ease-in-out infinite;
            }

            .wave-bar:nth-child(1) { height: 8px; animation-delay: 0s; }
            .wave-bar:nth-child(2) { height: 16px; animation-delay: 0.1s; }
            .wave-bar:nth-child(3) { height: 20px; animation-delay: 0.2s; }
            .wave-bar:nth-child(4) { height: 14px; animation-delay: 0.3s; }
            .wave-bar:nth-child(5) { height: 10px; animation-delay: 0.4s; }

            @keyframes waveform {
                0%, 100% { transform: scaleY(0.6); opacity: 0.6; }
                50% { transform: scaleY(1); opacity: 1; }
            }

            .timer-display {
                font-family: var(--font-heading, 'Orbitron', monospace);
                font-size: 13px;
                color: var(--accent-cyan, #00d4ff);
                letter-spacing: 0.1em;
                text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            }

            @media (max-width: 768px) {
                #session-timer {
                    top: 50px;
                    right: 10px;
                    padding: 6px 12px;
                }
                .timer-display {
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function startTimer() {
        updateDisplay();
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            updateDisplay();
            animateWaveform();
        }, 1000);
    }

    function updateDisplay() {
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        const h = document.getElementById('timer-hours');
        const m = document.getElementById('timer-minutes');
        const s = document.getElementById('timer-seconds');

        if (h) h.textContent = hours.toString().padStart(2, '0');
        if (m) m.textContent = minutes.toString().padStart(2, '0');
        if (s) s.textContent = seconds.toString().padStart(2, '0');
    }

    function animateWaveform() {
        const bars = document.querySelectorAll('.wave-bar');
        bars.forEach((bar, i) => {
            const randomHeight = 8 + Math.random() * 12;
            bar.style.height = randomHeight + 'px';
        });
    }

    function getElapsedTime() {
        return elapsedSeconds;
    }

    function resetTimer() {
        elapsedSeconds = 0;
        startTime = Date.now();
        localStorage.setItem(STORAGE_KEY, startTime);
        updateDisplay();
    }

    // Expose API
    window.SessionTimer = {
        getElapsedTime,
        resetTimer
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();