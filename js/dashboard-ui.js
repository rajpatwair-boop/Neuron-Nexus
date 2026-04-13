// ==========================================
// DASHBOARD UI - User Data Display
// ==========================================

const DashboardUI = {
    // Load and display user data
    async loadUserData() {
        if (!AuthUI.protectRoute()) return;

        try {
            // Fetch fresh user data
            const response = await APIService.getProfile();
            const user = response.data;

            // Update UI elements
            this.updateUserInfo(user);
            this.updateStats(user);
            
            // Store in localStorage for quick access
            localStorage.setItem('neural_user', JSON.stringify(user));

        } catch (error) {
            console.error('Failed to load user data:', error);
            
            // If token is invalid, logout
            if (error.message.includes('token') || error.message.includes('unauthorized')) {
                Toast.show('Session expired. Please login again.', 'warning');
                APIService.removeToken();
                setTimeout(() => window.location.reload(), 1500);
            } else {
                // Try to use cached data
                const cachedUser = localStorage.getItem('neural_user');
                if (cachedUser) {
                    this.updateUserInfo(JSON.parse(cachedUser));
                }
            }
        }
    },

    // Update user info section
    updateUserInfo(user) {
        // Update name
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = user.name || 'User';
        }

        // Update level
        const userLevelEl = document.getElementById('user-level');
        if (userLevelEl) {
            userLevelEl.textContent = user.level || 1;
        }

        // Update XP
        const xpTextEl = document.getElementById('xp-text');
        if (xpTextEl) {
            const currentXP = user.xp || 0;
            const level = user.level || 1;
            const xpForNextLevel = level * 100;
            const xpInCurrentLevel = currentXP - ((level - 1) * 100);
            xpTextEl.textContent = `${xpInCurrentLevel} / 100 XP`;
        }

        // Update XP bar
        const xpFillEl = document.getElementById('xp-fill');
        if (xpFillEl) {
            const level = user.level || 1;
            const currentXP = user.xp || 0;
            const xpInCurrentLevel = currentXP - ((level - 1) * 100);
            const percentage = Math.min((xpInCurrentLevel / 100) * 100, 100);
            xpFillEl.style.width = `${percentage}%`;
        }

        // Update current subject
        const currentSubjectEl = document.getElementById('current-subject');
        if (currentSubjectEl) {
            currentSubjectEl.textContent = user.currentSubject || 'Not selected';
        }

        // Update user menu avatar and dropdown
        this.updateUserMenu(user);
    },

    // Update user menu with current user data
    updateUserMenu(user) {
        // Update avatar initial
        const avatarInitial = document.getElementById('user-avatar-initial');
        if (avatarInitial && user.name) {
            avatarInitial.textContent = user.name.charAt(0).toUpperCase();
        }

        // Update dropdown info
        const dropdownUsername = document.getElementById('dropdown-username');
        const dropdownEmail = document.getElementById('dropdown-email');
        
        if (dropdownUsername && user.name) {
            dropdownUsername.textContent = user.name;
        }
        if (dropdownEmail && user.email) {
            dropdownEmail.textContent = user.email;
        }
    },

    // Update stats display
    updateStats(user) {
        // Update progress if element exists
        const progressEl = document.getElementById('user-progress');
        if (progressEl && user.progress) {
            const accuracy = user.progress.accuracy || 0;
            const total = user.progress.totalQuestions || 0;
            progressEl.textContent = `${accuracy}% accuracy (${total} questions)`;
        }

        // Update battle stats if element exists
        const battleStatsEl = document.getElementById('battle-stats');
        if (battleStatsEl && user.battleStats) {
            const wins = user.battleStats.wins || 0;
            const total = user.battleStats.totalBattles || 0;
            battleStatsEl.textContent = `${wins} wins / ${total} battles`;
        }
    },

    // Refresh dashboard data periodically
    startAutoRefresh(interval = 60000) {
        // Refresh every minute
        setInterval(() => {
            if (APIService.isAuthenticated()) {
                this.loadUserData();
            }
        }, interval);
    }
};

// Initialize dashboard when shown
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on dashboard and load data
    const dashboardScreen = document.getElementById('dashboard-screen');
    if (dashboardScreen?.classList.contains('active')) {
        DashboardUI.loadUserData();
    }

    // Start auto-refresh
    DashboardUI.startAutoRefresh();
});
