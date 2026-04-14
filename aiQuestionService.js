/**
 * AI Question Generation Service
 * Uses Groq API (FREE tier available) for dynamic question generation
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for storing recent questions (TTL: 1 hour)
const questionCache = new NodeCache({ stdTTL: 3600, maxKeys: 100 });

// Track used questions to avoid repetition
const usedQuestions = new Map();

// Groq API Configuration (FREE tier: 1,000,000 tokens/day)
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_demo_key'; // Set in .env
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Domain-specific prompts for better question quality
const DOMAIN_PROMPTS = {
    Programming: `Generate a programming/coding question. Focus on:
- Programming concepts, algorithms, data structures
- Language-agnostic logic or popular languages (Python, JavaScript, Java, C++)
- Practical coding scenarios and best practices`,

    Physics: `Generate a physics question. Focus on:
- Mechanics, thermodynamics, electromagnetism, or modern physics
- Real-world applications and problem-solving
- Conceptual understanding with mathematical reasoning`,

    Chemistry: `Generate a chemistry question. Focus on:
- Organic, inorganic, or physical chemistry concepts
- Chemical reactions, periodic table, bonding
- Laboratory scenarios and practical applications`,

    Biology: `Generate a biology question. Focus on:
- Cell biology, genetics, ecology, human anatomy
- Evolution, molecular biology, or biotechnology
- Real-world biological phenomena and processes`,

    Mathematics: `Generate a mathematics question. Focus on:
- Algebra, calculus, geometry, statistics, or number theory
- Problem-solving with clear mathematical reasoning
- Practical applications of mathematical concepts`,

    History: `Generate a history question. Focus on:
- World history, ancient civilizations, modern history
- Significant events, figures, and their impacts
- Historical analysis and cause-effect relationships`,

    Geography: `Generate a geography question. Focus on:
- Physical geography, human geography, or geopolitics
- Climate, landforms, population, or economic geography
- Environmental issues and global patterns`,

    'General Knowledge': `Generate a general knowledge question. Focus on:
- Science, technology, arts, culture, or current affairs
- Interesting facts and widely applicable knowledge
- Questions that test broad awareness and reasoning`
};

// Difficulty modifiers
const DIFFICULTY_CONFIG = {
    easy: {
        description: 'Beginner level - basic concepts, straightforward questions',
        complexity: 'simple'
    },
    medium: {
        description: 'Intermediate level - requires understanding and application',
        complexity: 'moderate'
    },
    hard: {
        description: 'Advanced level - complex scenarios, deep knowledge required',
        complexity: 'complex'
    }
};

/**
 * Generate a unique cache key
 */
function getCacheKey(domain, difficulty) {
    return `${domain}_${difficulty}_${Date.now()}`;
}

/**
 * Check if question is unique (not recently used)
 */
function isQuestionUnique(questionText, domain) {
    const domainQuestions = usedQuestions.get(domain) || new Set();
    if (domainQuestions.has(questionText.substring(0, 50))) {
        return false;
    }
    return true;
}

/**
 * Mark question as used
 */
function markQuestionUsed(questionText, domain) {
    if (!usedQuestions.has(domain)) {
        usedQuestions.set(domain, new Set());
    }
    const domainQuestions = usedQuestions.get(domain);
    domainQuestions.add(questionText.substring(0, 50));
    
    // Keep only last 50 questions per domain
    if (domainQuestions.size > 50) {
        const iterator = domainQuestions.values();
        domainQuestions.delete(iterator.next().value);
    }
}

/**
 * Generate question using Groq AI API
 */
async function generateWithGroq(domain, difficulty) {
    const domainPrompt = DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS['General Knowledge'];
    const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
    
    const systemPrompt = `You are an expert educational content creator. Generate high-quality multiple-choice questions for learning purposes.

${domainPrompt}

Difficulty: ${diffConfig.description}
Complexity: ${diffConfig.complexity}

STRICT OUTPUT FORMAT - Return ONLY a valid JSON object with this exact structure:
{
    "question": "Clear, concise question text (max 150 characters)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The exact text of the correct option",
    "explanation": "Brief explanation of why the answer is correct (max 100 characters)"
}

RULES:
- Exactly 4 options required
- Only ONE correct answer
- All options must be plausible but clearly distinguishable
- No "All of the above" or "None of the above" options
- Question should be educational and test understanding
- Avoid overly technical jargon unless necessary for the domain`;

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.1-8b-instant', // Fast and cost-effective
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Generate a ${difficulty} level question about ${domain}` }
                ],
                temperature: 0.7,
                max_tokens: 500,
                response_format: { type: 'json_object' }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        const content = response.data.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from AI');
        }

        const parsed = JSON.parse(content);
        
        // Validate structure
        if (!parsed.question || !Array.isArray(parsed.options) || 
            parsed.options.length !== 4 || !parsed.answer || !parsed.explanation) {
            throw new Error('Invalid question structure');
        }

        // Validate answer is in options
        if (!parsed.options.includes(parsed.answer)) {
            throw new Error('Answer not found in options');
        }

        return parsed;
    } catch (error) {
        console.error('Groq API Error:', error.message);
        throw error;
    }
}

/**
 * Get fallback static question
 */
function getFallbackQuestion(domain, difficulty) {
    const fallbacks = {
        Programming: {
            question: 'What is the time complexity of binary search?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answer: 'O(log n)',
            explanation: 'Binary search halves the search space each iteration.'
        },
        Physics: {
            question: 'What is the SI unit of force?',
            options: ['Watt', 'Joule', 'Newton', 'Pascal'],
            answer: 'Newton',
            explanation: 'Force is measured in Newtons (N), named after Isaac Newton.'
        },
        default: {
            question: 'What is the primary function of DNA?',
            options: ['Energy production', 'Protein synthesis', 'Cell division', 'Genetic information storage'],
            answer: 'Genetic information storage',
            explanation: 'DNA stores and transmits genetic information.'
        }
    };

    return fallbacks[domain] || fallbacks.default;
}

/**
 * Main function to generate question
 */
async function generateQuestion(domain = 'General Knowledge', difficulty = 'medium') {
    // Check cache first
    const cacheKey = `latest_${domain}_${difficulty}`;
    const cached = questionCache.get(cacheKey);
    
    if (cached && isQuestionUnique(cached.question, domain)) {
        markQuestionUsed(cached.question, domain);
        return { ...cached, source: 'cache' };
    }

    try {
        // Generate with AI
        const question = await generateWithGroq(domain, difficulty);
        
        // Validate uniqueness
        if (!isQuestionUnique(question.question, domain)) {
            console.log('Question not unique, regenerating...');
            return generateQuestion(domain, difficulty);
        }

        // Mark as used and cache
        markQuestionUsed(question.question, domain);
        questionCache.set(cacheKey, question);
        
        // Pre-generate next question in background
        setTimeout(() => pregenerateQuestion(domain, difficulty), 100);

        return { ...question, source: 'ai' };
    } catch (error) {
        console.error('AI Generation failed, using fallback:', error.message);
        const fallback = getFallbackQuestion(domain, difficulty);
        return { ...fallback, source: 'fallback' };
    }
}

/**
 * Pre-generate question for next use (background)
 */
async function pregenerateQuestion(domain, difficulty) {
    try {
        const question = await generateWithGroq(domain, difficulty);
        const cacheKey = `latest_${domain}_${difficulty}`;
        questionCache.set(cacheKey, question);
    } catch (error) {
        // Silently fail - not critical
        console.log('Pregeneration failed (non-critical)');
    }
}

/**
 * Get question batch for a session
 */
async function getQuestionBatch(domain, difficulty, count = 5) {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        try {
            const q = await generateQuestion(domain, difficulty);
            questions.push(q);
        } catch (error) {
            console.error(`Failed to generate question ${i + 1}:`, error);
        }
    }
    
    return questions;
}

/**
 * Clear cache and used questions
 */
function clearCache() {
    questionCache.flushAll();
    usedQuestions.clear();
}

module.exports = {
    generateQuestion,
    getQuestionBatch,
    clearCache,
    DIFFICULTY_CONFIG
};