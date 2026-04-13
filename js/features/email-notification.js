/**
 * Email Notification System
 * Sends real emails on course completion using EmailJS
 */

(function() {
    'use strict';

    const EmailNotification = {
        EMAILJS_CONFIG: {
            serviceId: 'service_neuroquest',
            templateId: 'template_completion',
            publicKey: '' // Will be set by user
        },
        
        init() {
            this.loadEmailJS();
            this.setupEventListeners();
            console.log('📧 Email Notification System initialized');
        },

        // Load EmailJS SDK
        loadEmailJS() {
            if (window.emailjs) return;
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => {
                console.log('✅ EmailJS SDK loaded');
                this.initializeEmailJS();
            };
            document.head.appendChild(script);
        },

        // Initialize EmailJS with stored or default key
        initializeEmailJS() {
            const storedKey = localStorage.getItem('emailjs_public_key');
            if (storedKey) {
                this.EMAILJS_CONFIG.publicKey = storedKey;
                try {
                    emailjs.init(storedKey);
                    console.log('✅ EmailJS initialized');
                } catch (e) {
                    console.log('⚠️ EmailJS init failed:', e);
                }
            } else {
                console.log('ℹ️ EmailJS public key not set. Use: setEmailJSKey("your_key")');
            }
        },

        // Setup event listeners
        setupEventListeners() {
            document.addEventListener('sendCompletionEmail', (e) => {
                this.sendCompletionEmail(e.detail);
            });
            
            document.addEventListener('completionTracked', (e) => {
                // Auto-send email after completion is tracked
                setTimeout(() => {
                    this.sendCompletionEmail(e.detail);
                }, 1000);
            });
        },

        // Send completion email
        async sendCompletionEmail(courseData) {
            const user = this.getCurrentUser();
            if (!user || !user.email) {
                console.error('No user email found');
                return;
            }

            // Check if EmailJS is configured
            if (!this.EMAILJS_CONFIG.publicKey) {
                console.log('⚠️ EmailJS not configured. Email queued for later.');
                this.queueEmail(courseData, user);
                return;
            }

            try {
                const templateParams = {
                    to_email: user.email,
                    to_name: user.name || user.username || 'Student',
                    course_name: courseData.courseName,
                    completion_date: new Date(courseData.completedAt).toLocaleDateString(),
                    score: courseData.score || 'N/A',
                    platform_name: 'NeuroQuest'
                };

                console.log('📤 Sending completion email to:', user.email);

                const response = await emailjs.send(
                    this.EMAILJS_CONFIG.serviceId,
                    this.EMAILJS_CONFIG.templateId,
                    templateParams
                );

                console.log('✅ Email sent successfully:', response);
                this.showNotification('📧 Completion email sent to your inbox!');
                
            } catch (error) {
                console.error('❌ Failed to send email:', error);
                this.queueEmail(courseData, user);
                this.showNotification('📧 Email queued - will retry later');
            }
        },

        // Queue email for later sending
        queueEmail(courseData, user) {
            const queue = JSON.parse(localStorage.getItem('email_queue') || '[]');
            queue.push({
                userEmail: user.email,
                userName: user.name || user.username,
                courseName: courseData.courseName,
                completedAt: courseData.completedAt,
                score: courseData.score,
                attempts: 0,
                queuedAt: Date.now()
            });
            localStorage.setItem('email_queue', JSON.stringify(queue));
        },

        // Retry queued emails
        async retryQueuedEmails() {
            if (!this.EMAILJS_CONFIG.publicKey) return;
            
            const queue = JSON.parse(localStorage.getItem('email_queue') || '[]');
            if (queue.length === 0) return;
            
            const remaining = [];
            
            for (const item of queue) {
                if (item.attempts >= 3) continue;
                
                try {
                    await emailjs.send(
                        this.EMAILJS_CONFIG.serviceId,
                        this.EMAILJS_CONFIG.templateId,
                        {
                            to_email: item.userEmail,
                            to_name: item.userName,
                            course_name: item.courseName,
                            completion_date: new Date(item.completedAt).toLocaleDateString(),
                            score: item.score || 'N/A',
                            platform_name: 'NeuroQuest'
                        }
                    );
                    console.log('✅ Queued email sent:', item.userEmail);
                } catch (error) {
                    item.attempts++;
                    remaining.push(item);
                }
            }
            
            localStorage.setItem('email_queue', JSON.stringify(remaining));
        },

        // Show notification
        showNotification(message) {
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 212, 255, 0.9);
                color: #0a0a0f;
                padding: 15px 20px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 99999;
                animation: slideIn 0.3s ease;
            `;
            notif.textContent = message;
            document.body.appendChild(notif);
            
            setTimeout(() => {
                notif.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }, 4000);
        },

        // Get current user
        getCurrentUser() {
            return window.AuthPersistence?.getUserData() || 
                   window.currentUser || 
                   JSON.parse(localStorage.getItem('neuroquest_user_data') || 'null');
        }
    };

    // Expose function to set EmailJS key
    window.setEmailJSKey = function(publicKey, serviceId, templateId) {
        if (!publicKey) {
            console.error('❌ Public key required');
            return;
        }
        
        localStorage.setItem('emailjs_public_key', publicKey);
        if (serviceId) localStorage.setItem('emailjs_service_id', serviceId);
        if (templateId) localStorage.setItem('emailjs_template_id', templateId);
        
        EmailNotification.EMAILJS_CONFIG.publicKey = publicKey;
        if (serviceId) EmailNotification.EMAILJS_CONFIG.serviceId = serviceId;
        if (templateId) EmailNotification.EMAILJS_CONFIG.templateId = templateId;
        
        if (window.emailjs) {
            emailjs.init(publicKey);
            console.log('✅ EmailJS key set and initialized');
            EmailNotification.retryQueuedEmails();
        }
        
        return '✅ EmailJS configured successfully!';
    };

    // Expose globally
    window.EmailNotification = EmailNotification;

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EmailNotification.init());
    } else {
        EmailNotification.init();
    }
})();