/**
 * AI Chatbot Frontend
 * Handles UI interactions and API communication
 */

const API_URL = window.location.origin;
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing');
const statusElement = document.getElementById('status');

let isTyping = false;

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage('user', message);
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show typing indicator
    showTyping(true);
    
    try {
        // Call API
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.success) {
            // Add AI response
            addMessage('assistant', data.response);
        } else {
            // Show error
            addMessage('assistant', `❌ ${data.error}`, true);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('assistant', '❌ Network error. Please check your connection and try again.', true);
    } finally {
        showTyping(false);
    }
}

// Add message to chat
function addMessage(role, content, isError = false) {
    // Remove welcome message if it exists
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}${isError ? ' error' : ''}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    const formattedContent = formatMessage(content);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formattedContent}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Format message content (convert markdown-like syntax)
function formatMessage(content) {
    // Escape HTML
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Bullet points
    formatted = formatted.replace(/^- (.+)$/gm, '• $1');
    
    return formatted;
}

// Show/hide typing indicator
function showTyping(show) {
    isTyping = show;
    typingIndicator.style.display = show ? 'flex' : 'none';
    sendBtn.disabled = show;
    statusElement.textContent = show ? 'Typing...' : 'Ready';
    statusElement.classList.toggle('typing', show);
    
    if (show) {
        scrollToBottom();
    }
}

// Scroll to bottom
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Clear chat
function clearChat() {
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">👋</div>
            <h2>Chat cleared!</h2>
            <p>Start a new conversation</p>
        </div>
    `;
}

// Check API health on load
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        
        if (!data.apiConfigured) {
            addMessage('assistant', '⚠️ <strong>API Key Not Configured</strong><br><br>Please set your OpenRouter API key in the server .env file.<br>Get your free key from: <a href="https://openrouter.ai/keys" target="_blank">openrouter.ai/keys</a>', true);
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI Chatbot loaded');
    console.log('📍 API URL:', API_URL);
    
    // Check health after a short delay
    setTimeout(checkHealth, 1000);
});