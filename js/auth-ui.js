// ==========================================
// AUTH UI - Professional Logout & User Menu
// ==========================================

const AuthUI = {
    // Initialize auth event listeners
    init() {
        this.setupLoginForm();
        this.setupSignupForm();
        this.setupUserMenu();
        this.setupLoadingOverlay();
        this.checkAutoLogin();
        this.protectDashboard();
    },

    // Setup login form
    setupLoginForm() {
        const loginBtn = document.getElementById('login-btn');
        if (!loginBtn) return;

        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value;

            if (!email || !password) {
                Toast.show('Please enter email and password', 'error');
                return;
            }

            // Show loading overlay
            this.showLoading('Authenticating...');

            try {
                const response = await APIService.login({ email, password });
                Toast.show('Welcome back!', 'success');
                
                setTimeout(() => {
                    this.hideLoading();
                    this.redirectToDashboard();
                }, 800);

            } catch (error) {
                this.hideLoading();
                Toast.show(error.message || 'Login failed', 'error');
            }
        });
    },

    // Setup signup form
    setupSignupForm() {
        const signupBtn = document.getElementById('signup-btn');
        if (!signupBtn) return;

        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name')?.value.trim();
            const email = document.getElementById('signup-email')?.value.trim();
            const password = document.getElementById('signup-password')?.value;

            if (!name || !email || !password) {
                Toast.show('Please fill all fields', 'error');
                return;
            }

            if (password.length < 6) {
                Toast.show('Password must be at least 6 characters', 'error');
                return;
            }

            // Show loading overlay
            this.showLoading('Creating account...');

            try {
                const response = await APIService.signup({ name, email, password });
                Toast.show('Welcome to Neural System!', 'success');
                
                setTimeout(() => {
                    this.hideLoading();
                    this.redirectToDashboard();
                }, 800);

            } catch (error) {
                this.hideLoading();
                Toast.show(error.message || 'Signup failed', 'error');
            }
        });
    },

    // Setup User Menu Dropdown
    setupUserMenu() {
        const menuTrigger = document.getElementById('user-menu-trigger');
        const dropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (!menuTrigger || !dropdown) return;

        // Toggle dropdown
        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menuTrigger.classList.toggle('active');
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuTrigger.contains(e.target) && !dropdown.contains(e.target)) {
                menuTrigger.classList.remove('active');
                dropdown.classList.remove('active');
            }
        });

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Profile button - Open Profile Modal
        const profileBtn = document.getElementById('dropdown-profile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.openProfileModal();
                this.closeDropdown();
            });
        }

        // Close profile modal
        const profileClose = document.getElementById('profile-close');
        if (profileClose) {
            profileClose.addEventListener('click', () => this.closeProfileModal());
        }

        // Close modal on background click
        const profileModal = document.getElementById('profile-modal');
        if (profileModal) {
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    this.closeProfileModal();
                }
            });
        }

        // Settings button - Open Settings Modal
        const settingsBtn = document.getElementById('dropdown-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettingsModal();
                this.closeDropdown();
            });
        }

        // Close settings modal
        const settingsClose = document.getElementById('settings-close');
        if (settingsClose) {
            settingsClose.addEventListener('click', () => this.closeSettingsModal());
        }

        // Close settings modal on background click
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.closeSettingsModal();
                }
            });
        }

        // Settings logout button
        const settingsLogout = document.getElementById('settings-logout');
        if (settingsLogout) {
            settingsLogout.addEventListener('click', () => {
                this.closeSettingsModal();
                this.logout();
            });
        }
    },

    // Close dropdown menu
    closeDropdown() {
        const menuTrigger = document.getElementById('user-menu-trigger');
        const dropdown = document.getElementById('user-dropdown');
        menuTrigger?.classList.remove('active');
        dropdown?.classList.remove('active');
    },

    // Open Profile Modal
    openProfileModal() {
        const modal = document.getElementById('profile-modal');
        if (!modal) return;

        // Get user data
        const user = JSON.parse(localStorage.getItem('neural_user') || '{}');
        
        // Update modal content
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const avatarEl = document.getElementById('profile-avatar-initial');
        const levelEl = document.getElementById('profile-level');
        const xpEl = document.getElementById('profile-xp');
        const subjectEl = document.getElementById('profile-subject');

        if (nameEl) nameEl.textContent = user.name || 'User';
        if (emailEl) emailEl.textContent = user.email || 'user@email.com';
        if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
        if (levelEl) levelEl.textContent = user.level || 1;
        if (xpEl) xpEl.textContent = user.xp || 0;
        if (subjectEl) subjectEl.textContent = user.currentSubject || 'None';

        // Show modal
        modal.classList.add('active');
    },

    // Close Profile Modal
    closeProfileModal() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Open Settings Modal
    openSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;

        // Get user data
        const user = JSON.parse(localStorage.getItem('neural_user') || '{}');
        
        // Update modal content
        const emailEl = document.getElementById('settings-email');
        const usernameEl = document.getElementById('settings-username');
        const userEmailEl = document.getElementById('settings-user-email');

        if (emailEl) emailEl.textContent = user.email || 'user@email.com';
        if (usernameEl) usernameEl.textContent = user.name || 'User';
        if (userEmailEl) userEmailEl.textContent = user.email || 'user@email.com';

        // Show modal
        modal.classList.add('active');
    },

    // Close Settings Modal
    closeSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Setup loading overlay
    setupLoadingOverlay() {
        if (document.getElementById('loading-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text" id="loading-text">Loading...</div>
        `;
        document.body.appendChild(overlay);
    },

    // Show loading overlay
    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const textEl = document.getElementById('loading-text');
        if (overlay) {
            if (textEl) textEl.textContent = text;
            overlay.classList.add('active');
        }
    },

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },

    // Logout
    logout() {
        this.closeDropdown();
        this.showLoading('Logging out...');
        
        setTimeout(() => {
            APIService.removeToken();
            this.hideLoading();
            Toast.show('Logged out successfully', 'info');
            
            // Redirect to auth screen
            setTimeout(() => {
                if (typeof State !== 'undefined') {
                    State.navigateTo('auth');
                } else {
                    window.location.reload();
                }
            }, 500);
        }, 800);
    },

    // Redirect to dashboard
    redirectToDashboard() {
        if (typeof State !== 'undefined') {
            State.navigateTo('dashboard');
            State.initDashboard();
        }
        DashboardUI.loadUserData();
        this.updateUserMenu();
    },

    // Update user menu with current user data
    updateUserMenu() {
        const user = JSON.parse(localStorage.getItem('neural_user') || '{}');
        
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

    // Check for auto-login
    checkAutoLogin() {
        if (APIService.isAuthenticated()) {
            const currentScreen = document.querySelector('.screen.active');
            const isAuthScreen = currentScreen?.id === 'auth-screen';
            
            if (isAuthScreen) {
                // Show loading during auto-login
                this.showLoading('Restoring session...');
                
                setTimeout(() => {
                    this.hideLoading();
                    this.redirectToDashboard();
                }, 600);
            } else {
                // Just update the menu if already on dashboard
                this.updateUserMenu();
            }
        }
    },

    // Protect dashboard - redirect if not authenticated
    protectDashboard() {
        const dashboardScreen = document.getElementById('dashboard-screen');
        const isDashboardActive = dashboardScreen?.classList.contains('active');
        
        if (isDashboardActive && !APIService.isAuthenticated()) {
            Toast.show('Please login to access dashboard', 'warning');
            
            setTimeout(() => {
                if (typeof State !== 'undefined') {
                    State.navigateTo('auth');
                }
            }, 1500);
        }
    },

    // Button loading state (for non-overlay loading)
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Loading...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
            button.style.opacity = '1';
        }
    },

    // Protect dashboard route
    protectRoute() {
        if (!APIService.isAuthenticated()) {
            Toast.show('Please login first', 'warning');
            if (typeof State !== 'undefined') {
                State.navigateTo('auth');
            }
            return false;
        }
        return true;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AuthUI.init();
});
