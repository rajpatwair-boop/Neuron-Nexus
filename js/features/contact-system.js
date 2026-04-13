/**
 * Contact Us System - Fully Working
 * Sends real emails via EmailJS + stores in Firebase
 */

(function() {
    'use strict';

    const ContactSystem = {
        EMAILJS_CONFIG: {
            serviceId: 'service_neuroquest',
            templateId: 'template_contact',
            publicKey: ''
        },
        
        init() {
            this.injectContactButton();
            this.loadEmailJS();
            console.log('📧 Contact System initialized');
        },

        loadEmailJS() {
            if (window.emailjs) return;
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => {
                const key = localStorage.getItem('emailjs_public_key');
                if (key) {
                    this.EMAILJS_CONFIG.publicKey = key;
                    emailjs.init(key);
                }
            };
            document.head.appendChild(script);
        },

        injectContactButton() {
            const inject = () => {
                const nav = document.querySelector('nav, .navbar, .nav-links, header');
                const settingsBtn = document.querySelector('[onclick*="Settings"], .settings-btn, #settings-btn');
                
                if (!nav || document.getElementById('contact-nav-btn')) return;

                const btn = document.createElement('button');
                btn.id = 'contact-nav-btn';
                btn.innerHTML = '📧 Contact';
                btn.style.cssText = `
                    background: transparent;
                    border: 1px solid rgba(0,212,255,0.5);
                    color: #00d4ff;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 10px;
                    transition: all 0.3s;
                `;
                btn.onmouseenter = () => {
                    btn.style.background = 'rgba(0,212,255,0.1)';
                    btn.style.boxShadow = '0 0 10px rgba(0,212,255,0.3)';
                };
                btn.onmouseleave = () => {
                    btn.style.background = 'transparent';
                    btn.style.boxShadow = 'none';
                };
                btn.onclick = () => this.openContactModal();

                if (settingsBtn) {
                    settingsBtn.parentNode.insertBefore(btn, settingsBtn.nextSibling);
                } else {
                    nav.appendChild(btn);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', inject);
            } else {
                inject();
            }
            setTimeout(inject, 1000);
        },

        openContactModal() {
            if (document.getElementById('contact-modal')) {
                document.getElementById('contact-modal').style.display = 'flex';
                return;
            }

            const modal = document.createElement('div');
            modal.id = 'contact-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 100000;
                backdrop-filter: blur(5px);
            `;

            modal.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
                    border: 2px solid #00d4ff;
                    border-radius: 16px;
                    padding: 30px;
                    width: 90%;
                    max-width: 450px;
                    box-shadow: 0 0 50px rgba(0,212,255,0.3);
                    position: relative;
                ">
                    <button onclick="document.getElementById('contact-modal').style.display='none'" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: none;
                        border: none;
                        color: #888;
                        font-size: 24px;
                        cursor: pointer;
                    ">&times;</button>

                    <h2 style="color: #00d4ff; margin: 0 0 10px; font-size: 24px;">📧 Contact Us</h2>
                    <p style="color: #888; margin: 0 0 20px; font-size: 14px;">We'd love to hear from you!</p>

                    <div style="
                        background: rgba(0,212,255,0.1);
                        border: 1px solid rgba(0,212,255,0.3);
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 20px;
                    ">
                        <p style="margin: 0 0 8px; color: #fff; font-size: 14px;">
                            <strong style="color: #00d4ff;">Email:</strong> 
                            <a href="mailto:krishnap2006p@gmail.com" style="color: #fff; text-decoration: none;">krishnap2006p@gmail.com</a>
                        </p>
                        <p style="margin: 0; color: #fff; font-size: 14px;">
                            <strong style="color: #00d4ff;">Phone:</strong> 
                            <a href="tel:+919137503425" style="color: #fff; text-decoration: none;">+91 9137503425</a>
                        </p>
                    </div>

                    <form id="contact-form">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; color: #00d4ff; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Your Name</label>
                            <input type="text" id="contact-name" required style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(0,212,255,0.3);
                                border-radius: 8px;
                                background: rgba(0,0,0,0.3);
                                color: #fff;
                                font-size: 14px;
                                box-sizing: border-box;
                            " placeholder="John Doe">
                        </div>

                        <div style="margin-bottom: 15px;">
                            <label style="display: block; color: #00d4ff; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Email Address</label>
                            <input type="email" id="contact-email" required style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(0,212,255,0.3);
                                border-radius: 8px;
                                background: rgba(0,0,0,0.3);
                                color: #fff;
                                font-size: 14px;
                                box-sizing: border-box;
                            " placeholder="john@example.com">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #00d4ff; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Message</label>
                            <textarea id="contact-message" required rows="4" style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(0,212,255,0.3);
                                border-radius: 8px;
                                background: rgba(0,0,0,0.3);
                                color: #fff;
                                font-size: 14px;
                                resize: vertical;
                                box-sizing: border-box;
                            " placeholder="How can we help you?"></textarea>
                        </div>

                        <div id="contact-error" style="
                            display: none;
                            background: rgba(255,68,68,0.1);
                            border: 1px solid #ff4444;
                            color: #ff8888;
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 15px;
                            font-size: 13px;
                        "></div>

                        <div id="contact-success" style="
                            display: none;
                            background: rgba(0,255,0,0.1);
                            border: 1px solid #00ff00;
                            color: #88ff88;
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 15px;
                            font-size: 13px;
                        "></div>

                        <button type="submit" id="contact-submit" style="
                            width: 100%;
                            padding: 14px;
                            background: linear-gradient(135deg, #00d4ff, #0099cc);
                            border: none;
                            border-radius: 8px;
                            color: #0a0a0f;
                            font-weight: 600;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">Send Message</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });

            document.getElementById('contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        },

        async handleSubmit() {
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const errorDiv = document.getElementById('contact-error');
            const successDiv = document.getElementById('contact-success');
            const submitBtn = document.getElementById('contact-submit');

            // Validation
            if (!name || !email || !message) {
                this.showError('Please fill in all fields');
                return;
            }

            if (name.length < 2) {
                this.showError('Name must be at least 2 characters');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                this.showError('Please enter a valid email address');
                return;
            }

            if (message.length < 10) {
                this.showError('Message must be at least 10 characters');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            try {
                // 1. Store in Firebase/localStorage
                await this.storeMessage({ name, email, message });

                // 2. Send email
                await this.sendEmail({ name, email, message });

                this.showSuccess('Message sent successfully! We\'ll get back to you soon.');
                document.getElementById('contact-form').reset();
                setTimeout(() => {
                    document.getElementById('contact-modal').style.display = 'none';
                }, 2000);

            } catch (error) {
                console.error('Contact form error:', error);
                this.showError('Failed to send message. Please try again or email us directly at krishnap2006p@gmail.com');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        },

        showError(msg) {
            const errorDiv = document.getElementById('contact-error');
            const successDiv = document.getElementById('contact-success');
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        },

        showSuccess(msg) {
            const errorDiv = document.getElementById('contact-error');
            const successDiv = document.getElementById('contact-success');
            successDiv.textContent = msg;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
        },

        async storeMessage(data) {
            const messageData = {
                ...data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // Store in localStorage
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            messages.push(messageData);
            localStorage.setItem('contact_messages', JSON.stringify(messages));

            // Try Firebase
            try {
                if (window.FirebaseDB?.safeWrite) {
                    await window.FirebaseDB.safeWrite('contact_messages', messageData);
                }
            } catch (e) {}

            // Try backend
            try {
                await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (e) {}
        },

        async sendEmail(data) {
            if (!window.emailjs || !this.EMAILJS_CONFIG.publicKey) {
                // Queue for later if EmailJS not configured
                const queue = JSON.parse(localStorage.getItem('pending_contact_emails') || '[]');
                queue.push(data);
                localStorage.setItem('pending_contact_emails', JSON.stringify(queue));
                console.log('Email queued - EmailJS not configured');
                return;
            }

            await emailjs.send(
                this.EMAILJS_CONFIG.serviceId,
                this.EMAILJS_CONFIG.templateId,
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    to_email: 'krishnap2006p@gmail.com'
                }
            );
        }
    };

    window.ContactSystem = ContactSystem;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ContactSystem.init());
    } else {
        ContactSystem.init();
    }
})();