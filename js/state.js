// ==========================================
// STATE MANAGEMENT SYSTEM
// ==========================================

const State = {
    user: {
        email: '',
        password: '',
        name: '',
        age: 0,
        academicLevel: '',
        subjects: [],
        preferredMode: '',
        xp: 0,
        level: 1,
        currentSubject: '',
        currentCategory: '',
        onboardingComplete: false,
        isLoggedIn: false
    },
    
    session: {
        currentScreen: 'entry',
        onboardingStep: 0,
        currentMode: null,
        currentQuestion: 0,
        questions: [],
        score: 0,
        totalQuestions: 5,
        battleOpponent: null,
        battleTimer: null,
        dungeonChallenge: 0
    },
    
    // Save user data to localStorage
    save() {
        try {
            localStorage.setItem('neuralUser', JSON.stringify(this.user));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    },
    
    // Save auth credentials
    saveAuth(email, password, name = '') {
        const users = this.getAllUsers();
        users[email] = { email, password, name };
        localStorage.setItem('neuralUsers', JSON.stringify(users));
    },
    
    // Get all registered users
    getAllUsers() {
        const users = localStorage.getItem('neuralUsers');
        return users ? JSON.parse(users) : {};
    },
    
    // Verify login credentials
    verifyAuth(email, password) {
        const users = this.getAllUsers();
        return users[email] && users[email].password === password;
    },
    
    // Load user by email
    loadUserByEmail(email) {
        const users = this.getAllUsers();
        if (users[email]) {
            this.user = { ...this.user, ...users[email] };
            this.user.isLoggedIn = true;
            this.save();
        }
    },
    
    // Load user data from localStorage
    load() {
        try {
            const saved = localStorage.getItem('neuralUser');
            if (saved) {
                this.user = JSON.parse(saved);
                return true;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
        return false;
    },
    
    // Add XP and handle level up
    addXP(amount) {
        this.user.xp += amount;
        const xpNeeded = this.user.level * 100;
        
        // Notify immersion layer
        if (typeof ImmersionLayer !== 'undefined') {
            ImmersionLayer.onXPGain(amount);
        }
        
        if (this.user.xp >= xpNeeded) {
            this.user.level++;
            this.user.xp = this.user.xp - xpNeeded;
            this.showLevelUp();
            
            // Notify immersion layer of level up
            if (typeof ImmersionLayer !== 'undefined') {
                ImmersionLayer.onLevelUp();
            }
        }
        
        this.updateXPBar();
        this.save();
        return amount;
    },
    
    // Update XP bar UI
    updateXPBar() {
        const xpFill = document.getElementById('xp-fill');
        const xpText = document.getElementById('xp-text');
        const userLevel = document.getElementById('user-level');
        
        if (xpFill && xpText) {
            const xpNeeded = this.user.level * 100;
            const percentage = (this.user.xp / xpNeeded) * 100;
            xpFill.style.width = `${percentage}%`;
            xpText.textContent = `${this.user.xp} / ${xpNeeded} XP`;
        }
        
        if (userLevel) {
            userLevel.textContent = this.user.level;
        }
    },
    
    // Show level up notification
    showLevelUp() {
        this.showModal(
            'LEVEL UP!',
            `Congratulations! You've reached Level ${this.user.level}`,
            'Continue'
        );
    },
    
    // Track modal state to prevent duplicates
    _modalActive: false,
    _modalCallback: null,
    
    // Show custom modal
    showModal(title, message, btnText = 'Continue', callback = null) {
        // Prevent duplicate modals - if already showing, just update content
        if (this._modalActive) {
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const modalBtn = document.getElementById('modal-btn');
            
            if (modalTitle && modalMessage && modalBtn) {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalBtn.textContent = btnText;
                
                // Remove old glitch effect if present
                modalTitle.classList.remove('glitch-text');
                modalTitle.removeAttribute('data-text');
                
                // Add typing effect to title for account created
                if (title === 'Account Created') {
                    modalTitle.classList.add('glitch-text');
                    modalTitle.setAttribute('data-text', title);
                }
                
                // Store new callback
                this._modalCallback = callback;
            }
            return;
        }
        
        const modal = document.getElementById('custom-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalBtn = document.getElementById('modal-btn');
        
        if (modal && modalTitle && modalMessage && modalBtn) {
            // Mark modal as active
            this._modalActive = true;
            this._modalCallback = callback;
            
            // Clear any existing content first
            modalTitle.textContent = '';
            modalMessage.textContent = '';
            modalBtn.textContent = '';
            modalTitle.classList.remove('glitch-text');
            modalTitle.removeAttribute('data-text');
            
            // Set new content
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalBtn.textContent = btnText;
            
            // Add animation classes
            modal.style.display = 'flex';
            modal.classList.remove('modal-exiting', 'modal-visible');
            modal.classList.add('modal-entering');
            
            // Trigger animation
            setTimeout(() => {
                modal.classList.remove('modal-entering');
                modal.classList.add('modal-visible');
            }, 10);
            
            // Add typing effect to title for account created
            if (title === 'Account Created') {
                modalTitle.classList.add('glitch-text');
                modalTitle.setAttribute('data-text', title);
            }
            
            modalBtn.onclick = () => {
                modal.classList.remove('modal-visible');
                modal.classList.add('modal-exiting');
                
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('modal-exiting', 'modal-entering', 'modal-visible');
                    this._modalActive = false;
                    const cb = this._modalCallback;
                    this._modalCallback = null;
                    if (cb) cb();
                }, 300);
            };
        }
    },
    
    // Reset session data
    resetSession() {
        console.log('=== RESETTING SESSION ===');
        console.log('Before reset:', JSON.parse(JSON.stringify(this.session)));
        
        this.session.currentMode = null;
        this.session.currentQuestion = 0;
        this.session.questions = [];
        this.session.score = 0;
        this.session.dungeonChallenge = 0;
        this.session.playerScore = 0;
        this.session.battleOpponent = null;
        
        if (this.session.battleTimer) {
            clearInterval(this.session.battleTimer);
            this.session.battleTimer = null;
        }
        
        console.log('After reset:', JSON.parse(JSON.stringify(this.session)));
        console.log('===========================');
    },
    
    // Navigate to screen
    navigateTo(screenId) {
        // Pause dashboard video if leaving dashboard
        if (this.session.currentScreen === 'dashboard' && screenId !== 'dashboard') {
            this.deactivateDashboardVideo();
        }
        
        // Remove active from all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Add active to target screen
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.session.currentScreen = screenId;
        }
    },
    
    // Initialize dashboard with user data
    initDashboard() {
        const userName = document.getElementById('user-name');
        const currentSubject = document.getElementById('current-subject');
        
        if (userName) {
            userName.textContent = this.user.name;
        }
        
        if (currentSubject) {
            currentSubject.textContent = this.user.currentSubject || 'Not selected';
        }
        
        this.updateXPBar();
        
        // Notify DNA system of dashboard load
        if (typeof UserDNASystem !== 'undefined') {
            UserDNASystem.onDashboardLoad();
        }
        
        // Activate dashboard background video
        this.activateDashboardVideo();
    },
    
    // Activate dashboard background video
    activateDashboardVideo() {
        const video = document.getElementById('dashboard-video');
        if (!video) {
            console.warn('Dashboard video element not found');
            return;
        }
        
        // Force visibility
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';
        
        // Ensure muted for autoplay
        video.muted = true;
        video.volume = 0;
        
        // Try to play
        const playAttempt = () => {
            video.play().then(() => {
                console.log('Dashboard video playing');
            }).catch(err => {
                console.log('Video autoplay blocked, retrying...', err);
                // Retry after short delay
                setTimeout(playAttempt, 100);
            });
        };
        
        playAttempt();
        
        // Fallback: play on any user interaction
        const tryPlayOnInteraction = () => {
            video.play().catch(() => {});
        };
        
        document.addEventListener('click', tryPlayOnInteraction, { once: true });
        document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
    },
    
    // Deactivate dashboard background video
    deactivateDashboardVideo() {
        const video = document.getElementById('dashboard-video');
        if (video) {
            video.pause();
            console.log('Dashboard video paused');
        }
    },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = State;
}
