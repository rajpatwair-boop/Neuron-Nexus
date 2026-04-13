/**
 * Authentication Persistence System
 * Keeps user logged in across page refreshes
 */

(function() {
    'use strict';

    const AuthPersistence = {
        STORAGE_KEY: 'neuroquest_auth_session',
        USER_KEY: 'neuroquest_user_data',
        
        init() {
            this.setupAutoLogin();
            this.interceptLogout();
            console.log('🔐 Auth Persistence System initialized');
        },

        // Save session on login
        saveSession(token, userData) {
            const session = {
                token: token,
                userId: userData.id || userData._id,
                email: userData.email,
                name: userData.name || userData.username,
                timestamp: Date.now(),
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
            
            console.log('💾 Session saved for:', userData.email);
        },

        // Get stored session
        getSession() {
            try {
                const sessionStr = localStorage.getItem(this.STORAGE_KEY);
                if (!sessionStr) return null;
                
                const session = JSON.parse(sessionStr);
                
                // Check expiration
                if (session.expiresAt && Date.now() > session.expiresAt) {
                    this.clearSession();
                    return null;
                }
                
                return session;
            } catch (e) {
                return null;
            }
        },

        // Get stored user data
        getUserData() {
            try {
                const userStr = localStorage.getItem(this.USER_KEY);
                return userStr ? JSON.parse(userStr) : null;
            } catch (e) {
                return null;
            }
        },

        // Clear session on logout
        clearSession() {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.USER_KEY);
            console.log('🚪 Session cleared');
        },

        // Auto-login on page load
        setupAutoLogin() {
            // Wait for DOM and other scripts to load
            setTimeout(() => {
                this.attemptAutoLogin();
            }, 500);
        },

        // Attempt to restore session
        async attemptAutoLogin() {
            const session = this.getSession();
            const userData = this.getUserData();
            
            if (!session || !userData) {
                console.log('ℹ️ No stored session found');
                return;
            }

            console.log('🔄 Attempting auto-login for:', userData.email);

            // Validate token with backend
            const isValid = await this.validateToken(session.token);
            
            if (isValid) {
                console.log('✅ Auto-login successful');
                this.restoreUserSession(userData, session.token);
            } else {
                console.log('❌ Token invalid, clearing session');
                this.clearSession();
            }
        },

        // Validate token with backend
        async validateToken(token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                return response.ok;
            } catch (error) {
                // If backend is unavailable, assume token is valid for now
                console.log('⚠️ Backend unavailable, using cached session');
                return true;
            }
        },

        // Restore user session in UI
        restoreUserSession(userData, token) {
            // Set global user state
            window.currentUser = userData;
            window.authToken = token;
            
            // Update UI elements
            this.updateUIForLoggedInUser(userData);
            
            // Redirect to dashboard if on login page
            if (window.location.href.includes('login') || 
                window.location.href.includes('index') && !window.location.href.includes('dashboard')) {
                window.location.href = '/dashboard.html';
            }
            
            // Dispatch event for other components
            document.dispatchEvent(new CustomEvent('userSessionRestored', {
                detail: { user: userData, token: token }
            }));
        },

        // Update UI for logged in user
        updateUIForLoggedInUser(userData) {
            // Update username displays
            document.querySelectorAll('.username, #username, .user-name').forEach(el => {
                el.textContent = userData.name || userData.username || userData.email;
            });
            
            // Update email displays
            document.querySelectorAll('.user-email, #user-email').forEach(el => {
                el.textContent = userData.email;
            });
            
            // Show logged-in elements
            document.querySelectorAll('.logged-in-only').forEach(el => {
                el.style.display = '';
            });
            
            // Hide logged-out elements
            document.querySelectorAll('.logged-out-only').forEach(el => {
                el.style.display = 'none';
            });
        },

        // Intercept logout to clear session
        interceptLogout() {
            // Override any existing logout functions
            const originalLogout = window.logout || window.handleLogout;
            
            window.logout = window.handleLogout = () => {
                this.clearSession();
                if (originalLogout) originalLogout();
                else window.location.href = '/login.html';
            };
        },

        // Check if user is logged in
        isLoggedIn() {
            return !!this.getSession();
        },

        // Get auth token
        getToken() {
            const session = this.getSession();
            return session ? session.token : null;
        }
    };

    // Expose globally
    window.AuthPersistence = AuthPersistence;

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AuthPersistence.init());
    } else {
        AuthPersistence.init();
    }
})();