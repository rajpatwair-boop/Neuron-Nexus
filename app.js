/**
 * AI Chatbot Application
 * Multi-mode chat with voice input/output and memory
 */

class ChatApp {
    constructor() {
        this.currentMode = 'general';
        this.messages = [];
        this.userId = this.getOrCreateUserId();
        this.isTyping = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isRecording = false;
        
        this.modeConfig = {
            general: { icon: '🤖', name: 'General Mode' },
            study: { icon: '📚', name: 'Study Mode' },
            coding: { icon: '💻', name: 'Coding Mode' }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupVoiceInput();
        this.loadChatHistory();
        console.log('🚀 Chat App Initialized');
        console.log('👤 User ID:', this.userId);
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', userId);
        }
        return userId;
    }

    setupEventListeners() {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        // Input validation
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
        });

        // Voice output toggle
        const voiceToggle = document.getElementById('voice-output-toggle');
        voiceToggle.addEventListener('change', (e) => {
            localStorage.setItem('voice_output_enabled', e.target.checked);
        });
        
        // Load saved preference
        const savedPreference = localStorage.getItem('voice_output_enabled');
        if (savedPreference !== null) {
            voiceToggle.checked = savedPreference === 'true';
        }
    }

    setupVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isRecording = true;
                document.getElementById('voice-btn').classList.add('recording');
                this.showToast('Listening... Speak now', 'info');
            };

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const input = document.getElementById('message-input');
                if (finalTranscript) {
                    input.value = finalTranscript;
                    this.autoResize(input);
                    document.getElementById('send-btn').disabled = false;
                } else if (interimTranscript) {
                    input.value = interimTranscript;
                    this.autoResize(input);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showToast('Voice input error: ' + event.error, 'error');
                this.stopRecording();
            };

            this.recognition.onend = () => {
                this.stopRecording();
            };
        } else {
            document.getElementById('voice-btn').style.display = 'none';
            console.log('Speech recognition not supported');
        }
    }

    stopRecording() {
        this.isRecording = false;
        document.getElementById('voice-btn').classList.remove('recording');
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.showToast('Voice input not supported in this browser', 'error');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                this.showToast('Could not start voice input', 'error');
            }
        }
    }

    speakText(text) {
        const voiceToggle = document.getElementById('voice-output-toggle');
        if (!voiceToggle.checked || !this.synthesis) return;

        // Stop any current speech
        this.synthesis.cancel();

        // Clean text for speech (remove code blocks, markdown)
        const cleanText = text
            .replace(/```[\s\S]*?```/g, 'Code block omitted.')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\*\*|__/g, '')
            .replace(/#{1,6}\s/g, '')
            .substring(0, 500); // Limit length

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to use a good English voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.name.includes('Google US English') || 
            v.name.includes('Samantha') ||
            v.name.includes('Microsoft Zira')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synthesis.speak(utterance);
    }

    setMode(mode) {
        if (!this.modeConfig[mode]) return;
        
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        // Update header
        const config = this.modeConfig[mode];
        document.getElementById('current-mode-icon').textContent = config.icon;
        document.getElementById('current-mode-name').textContent = config.name;

        // Load history for this mode
        this.loadChatHistory();
        
        this.showToast(`Switched to ${config.name}`, 'success');
    }

    async loadChatHistory() {
        try {
            const response = await fetch(`/api/chat/history/${this.userId}?mode=${this.currentMode}`);
            const data = await response.json();

            if (data.success && data.chats.length > 0) {
                // Use the most recent chat
                const recentChat = data.chats[0];
                this.messages = recentChat.messages || [];
                this.renderMessages();
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        
        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">👋</div>
                    <h1>Welcome to AI Chat</h1>
                    <p>I'm your intelligent assistant. Select a mode and start chatting!</p>
                    <div class="suggestion-chips">
                        <button onclick="chatApp.setInput('Explain quantum physics simply')">Explain quantum physics</button>
                        <button onclick="chatApp.setInput('Write a Python function to sort a list')">Python sorting function</button>
                        <button onclick="chatApp.setInput('Help me understand photosynthesis')">Photosynthesis</button>
                        <button onclick="chatApp.setInput('What are the best practices for React?')">React best practices</button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.messages.forEach(msg => {
            this.appendMessageToDOM(msg.role, msg.content, false);
        });
        
        this.scrollToBottom();
    }

    appendMessageToDOM(role, content, animate = true) {
        const container = document.getElementById('chat-messages');
        
        // Remove welcome message if exists
        const welcome = container.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        if (animate) messageDiv.style.animation = 'fadeIn 0.3s ease';

        const avatar = role === 'user' ? '👤' : this.modeConfig[this.currentMode].icon;
        const formattedContent = this.formatMessage(content);

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${formattedContent}
                <div class="message-actions">
                    <button class="action-btn" onclick="chatApp.copyMessage(this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                    ${role === 'assistant' ? `
                    <button class="action-btn" onclick="chatApp.speakText(\`${content.replace(/`/g, '\\`')}\`)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        Read
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        container.appendChild(messageDiv);
        
        // Apply syntax highlighting
        messageDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        if (animate) {
            this.scrollToBottom();
        }
    }

    formatMessage(content) {
        // Escape HTML
        let formatted = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Code blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
        });

        // Inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Clear input
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('send-btn').disabled = true;

        // Add user message
        this.messages.push({ role: 'user', content: message });
        this.appendMessageToDOM('user', message);

        // Show typing indicator
        this.showTypingIndicator();
        this.isTyping = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    mode: this.currentMode,
                    userId: this.userId
                })
            });

            const data = await response.json();

            this.hideTypingIndicator();
            this.isTyping = false;

            if (data.success) {
                // Add AI response
                this.messages.push({ role: 'assistant', content: data.response });
                this.appendMessageToDOM('assistant', data.response);
                
                // Speak response
                this.speakText(data.response);
            } else {
                this.showError(data.error || 'Failed to get response');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.isTyping = false;
            console.error('Send message error:', error);
            this.showError('Network error. Please try again.');
        }
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'none';
    }

    showError(message) {
        this.appendMessageToDOM('assistant', `❌ **Error:** ${message}`);
        this.showToast(message, 'error');
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    setInput(text) {
        const input = document.getElementById('message-input');
        input.value = text;
        input.focus();
        this.autoResize(input);
        document.getElementById('send-btn').disabled = false;
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages');
        container.scrollTop = container.scrollHeight;
    }

    copyMessage(btn) {
        const messageContent = btn.closest('.message-content').childNodes[0].textContent;
        navigator.clipboard.writeText(messageContent).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }

    clearChat() {
        this.messages = [];
        this.renderMessages();
        this.showToast('Chat cleared', 'success');
    }

    toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app
const chatApp = new ChatApp();

// Load voices for speech synthesis
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('🎙️ Voices loaded');
    };
}