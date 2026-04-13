// ==========================================
// API SERVICE - Frontend Backend Integration
// ==========================================

const API_BASE_URL = 'http://localhost:5000/api';

// API Service Object
const APIService = {
    // Get stored token
    getToken() {
        return localStorage.getItem('neural_token');
    },

    // Set token
    setToken(token) {
        localStorage.setItem('neural_token', token);
    },

    // Remove token (logout)
    removeToken() {
        localStorage.removeItem('neural_token');
        localStorage.removeItem('neural_user');
    },

    // Check if authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Generic fetch with auth header
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // AUTH APIs
    async signup(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        
        // Store token and user
        if (data.data?.token) {
            this.setToken(data.data.token);
            localStorage.setItem('neural_user', JSON.stringify(data.data.user));
        }
        
        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Store token and user
        if (data.data?.token) {
            this.setToken(data.data.token);
            localStorage.setItem('neural_user', JSON.stringify(data.data.user));
        }
        
        return data;
    },

    // USER APIs
    async getProfile() {
        return this.fetchWithAuth('/user/profile');
    },

    async updateProfile(updateData) {
        return this.fetchWithAuth('/user/update', {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    },

    // GAME APIs
    async submitAnswer(answerData) {
        return this.fetchWithAuth('/game/submit-answer', {
            method: 'POST',
            body: JSON.stringify(answerData)
        });
    },

    async getProgress() {
        return this.fetchWithAuth('/game/progress');
    },

    // QUESTION APIs
    async getQuestions(subject, difficulty = 'medium', academicLevel = 'School', limit = 5) {
        const query = new URLSearchParams({ subject, difficulty, academicLevel, limit });
        return this.fetchWithAuth(`/questions?${query}`);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
