const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// System prompts for different modes
const SYSTEM_PROMPTS = {
  study: `You are an expert teacher and educational mentor. Your role is to:
- Explain concepts step-by-step in simple, clear language
- Use analogies and examples to make learning easier
- Encourage curiosity and critical thinking
- Break down complex topics into digestible parts
- Ask follow-up questions to ensure understanding
- Be patient, supportive, and motivating`,

  coding: `You are a professional programmer and software engineer. Your role is to:
- Provide correct, well-structured, and efficient code
- Explain the code logic clearly with comments
- Follow best practices and coding standards
- Suggest improvements and optimizations when relevant
- Include error handling in your examples
- Format code blocks properly for readability`,

  general: `You are a smart, helpful AI assistant. Your role is to:
- Answer questions clearly and concisely
- Provide accurate and up-to-date information
- Be friendly, professional, and engaging
- Offer helpful suggestions and insights
- Admit when you don't know something
- Adapt your tone to match the user's needs`
};

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async generateResponse(message, mode = 'general', chatHistory = []) {
    try {
      const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;
      
      // Build messages array for OpenRouter
      const messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      // Add chat history (last 10 messages for context)
      const recentHistory = chatHistory.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
      
      // Add current message
      messages.push({ role: 'user', content: message });

      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'openai/gpt-3.5-turbo',
          messages: messages
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('OpenRouter response:', response.data);

      // Extract response text
      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        return content.trim();
      }

      throw new Error('Empty response from OpenRouter API');

    } catch (error) {
      console.error('OpenRouter API Error:', error.message);
      
      if (error.response) {
        console.error('API Response:', error.response.data);
        
        // Handle specific error cases
        if (error.response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (error.response.status === 400) {
          throw new Error('Invalid request. Please check your message and try again.');
        }
        if (error.response.status === 401) {
          throw new Error('API key invalid. Please check your configuration.');
        }
      }
      
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }
}

module.exports = new OpenRouterService();