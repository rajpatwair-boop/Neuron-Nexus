// ==========================================
// TOAST NOTIFICATION SYSTEM
// Modern replacement for alert()
// ==========================================

const Toast = {
    container: null,

    // Initialize toast container
    init() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    },

    // Show toast notification
    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        
        // Color scheme based on type
        const colors = {
            success: {
                bg: 'rgba(0, 255, 136, 0.15)',
                border: 'rgba(0, 255, 136, 0.4)',
                text: '#00ff88',
                icon: '✓'
            },
            error: {
                bg: 'rgba(255, 59, 59, 0.15)',
                border: 'rgba(255, 59, 59, 0.4)',
                text: '#ff3b3b',
                icon: '✕'
            },
            warning: {
                bg: 'rgba(255, 215, 0, 0.15)',
                border: 'rgba(255, 215, 0, 0.4)',
                text: '#ffd700',
                icon: '⚠'
            },
            info: {
                bg: 'rgba(0, 240, 255, 0.15)',
                border: 'rgba(0, 240, 255, 0.4)',
                text: '#00f0ff',
                icon: 'ℹ'
            }
        };

        const color = colors[type] || colors.info;

        toast.style.cssText = `
            background: ${color.bg};
            border: 1px solid ${color.border};
            color: ${color.text};
            padding: 16px 20px;
            border-radius: 8px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 280px;
            max-width: 400px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px ${color.border};
            transform: translateX(100px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.2rem; font-weight: bold;">${color.icon}</span>
            <span style="flex: 1;">${message}</span>
            <button style="
                background: none;
                border: none;
                color: ${color.text};
                cursor: pointer;
                font-size: 1.2rem;
                opacity: 0.7;
                transition: opacity 0.2s;
            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
        `;

        // Close button functionality
        toast.querySelector('button').addEventListener('click', () => {
            this.hide(toast);
        });

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        // Auto hide
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    },

    // Hide toast
    hide(toast) {
        toast.style.transform = 'translateX(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    },

    // Convenience methods
    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
});
