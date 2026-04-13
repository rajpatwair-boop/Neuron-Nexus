/**
 * AI Question Generator
 * Transforms any concept into multiple academic question types
 */

(function() {
    'use strict';

    const QuestionGeneratorAI = {
        // Generate questions from user input
        async generate(topic) {
            if (!topic || topic.trim().length < 2) {
                return this.getErrorResponse();
            }

            try {
                // Try AI API first
                const aiQuestions = await this.getAIQuestions(topic);
                if (aiQuestions) return aiQuestions;
            } catch (error) {
                console.log('AI generation failed, using template:', error.message);
            }

            // Fallback to template-based generation
            return this.getTemplateQuestions(topic);
        },

        // Get questions from AI API
        async getAIQuestions(topic) {
            const prompt = `You are an expert academic question generator.

Generate 6 different types of questions about: "${topic}"

REQUIRED FORMAT - Include ALL 6 sections:

1. Direct Question:
[Ask a straightforward question]

2. MCQ:
[Question]
A) [option]
B) [option]
C) [correct option]
D) [option]

3. Fill in the blank:
[Sentence with _____ for answer]

4. True/False:
[Statement] (True/False)

5. Word Problem:
[Real-life scenario question]

6. Conceptual/Tricky Question:
[Question that tests deeper understanding]

RULES:
- Questions should be school/college level
- Make questions clear and unambiguous
- MCQ should have one clearly correct answer
- Word problem must be realistic
- Conceptual question should make students think
- Do NOT include answers unless asked`;

            // Try Gemini
            try {
                const response = await fetch(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDemoKeyForTestingOnly',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text && text.includes('1. Direct Question')) {
                        return this.formatAIResponse(text);
                    }
                }
            } catch (e) {
                console.log('Gemini failed');
            }

            // Try Groq backup
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer gsk_demo_key'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.1-8b-instant',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 800,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.choices?.[0]?.message?.content;
                    if (text && text.includes('1. Direct Question')) {
                        return this.formatAIResponse(text);
                    }
                }
            } catch (e) {
                console.log('Groq failed');
            }

            return null;
        },

        // Format AI response
        formatAIResponse(text) {
            // Clean up the response
            text = text.replace(/^(Here are|Below are|I've generated).*/i, '');
            text = text.trim();
            return text;
        },

        // Template-based question generation
        getTemplateQuestions(topic) {
            const lower = topic.toLowerCase();
            
            // Math - Addition
            if (lower.match(/\d+\s*\+\s*\d+/)) {
                const nums = topic.match(/(\d+)/g);
                const a = parseInt(nums[0]);
                const b = parseInt(nums[1]);
                const sum = a + b;
                
                return `Topic: ${topic}

1. Direct Question:
What is ${a} + ${b}?

2. MCQ:
What is the sum of ${a} and ${b}?
A) ${sum - 2}
B) ${sum - 1}
C) ${sum}
D) ${sum + 1}

3. Fill in the blank:
${a} + ${b} = _____

4. True/False:
${a} + ${b} = ${sum + 1} (True/False)

5. Word Problem:
Sarah has ${a} chocolates. Her friend gives her ${b} more chocolates. How many chocolates does Sarah have now?

6. Conceptual Question:
If you add ${a} and ${b}, and then add the result to itself, what do you get? Explain why.`;
            }
            
            // Math - Multiplication
            if (lower.match(/\d+\s*\*|\d+\s*x\s*\d+|multiply/i)) {
                const nums = topic.match(/(\d+)/g);
                const a = parseInt(nums[0]);
                const b = parseInt(nums[1] || 2);
                const product = a * b;
                
                return `Topic: ${topic}

1. Direct Question:
What is ${a} × ${b}?

2. MCQ:
Calculate: ${a} × ${b} = ?
A) ${product - 10}
B) ${product - 5}
C) ${product}
D) ${product + 5}

3. Fill in the blank:
${a} multiplied by ${b} equals _____.

4. True/False:
${a} × ${b} = ${b} × ${a} (True/False)

5. Word Problem:
A box contains ${a} pencils. If you have ${b} such boxes, how many pencils do you have in total?

6. Conceptual Question:
Why is ${a} × ${b} the same as adding ${a} to itself ${b} times? Explain with an example.`;
            }
            
            // Programming - Arrays
            if (lower.includes('array') || lower.includes('arrays')) {
                return `Topic: Arrays

1. Direct Question:
What is an array in programming?

2. MCQ:
Which of the following correctly declares an array in JavaScript?
A) var arr = (1, 2, 3);
B) var arr = [1, 2, 3];
C) var arr = {1, 2, 3};
D) var arr = <1, 2, 3>;

3. Fill in the blank:
In most programming languages, array indices start from _____.

4. True/False:
An array can store elements of different data types. (True/False)

5. Word Problem:
A teacher wants to store the test scores of 30 students. Should they use 30 separate variables or one array? Why?

6. Conceptual Question:
Why does accessing arr[5] give you the 6th element in an array, not the 5th? Explain the concept of zero-based indexing.`;
            }
            
            // Programming - Loops
            if (lower.includes('loop') || lower.includes('for') || lower.includes('while')) {
                return `Topic: Loops in Programming

1. Direct Question:
What is the difference between a for loop and a while loop?

2. MCQ:
How many times will this loop run? for(let i=0; i<5; i++)
A) 4 times
B) 5 times
C) 6 times
D) Infinite times

3. Fill in the blank:
A _____ loop is best used when you know exactly how many times you want to iterate.

4. True/False:
A while loop will execute at least once even if the condition is false. (True/False)

5. Word Problem:
You need to print "Hello" 100 times for a school project. Write the loop structure you would use and explain why.

6. Conceptual Question:
What happens if you forget to increment i (i++) in a for loop? What is this situation called and how can you prevent it?`;
            }
            
            // Physics - Newton's Laws
            if (lower.includes('newton') || lower.includes('force') || lower.includes('motion')) {
                return `Topic: Newton's Laws of Motion

1. Direct Question:
State Newton's First Law of Motion.

2. MCQ:
According to Newton's Third Law, if you push a wall with 10N force, the wall pushes back with:
A) 0N
B) 5N
C) 10N
D) 20N

3. Fill in the blank:
Newton's Second Law states that Force equals _____ times _____.

4. True/False:
An object in motion will stay in motion forever unless acted upon by an external force. (True/False)

5. Word Problem:
A 1000kg car accelerates at 2 m/s². Calculate the force exerted by the engine using Newton's Second Law.

6. Conceptual Question:
When you jump, you push down on the ground. Why does the ground push you up? Which Newton's law explains this, and how would the jump be different on the Moon?`;
            }
            
            // Chemistry - Atoms
            if (lower.includes('atom') || lower.includes('atomic')) {
                return `Topic: Atomic Structure

1. Direct Question:
Name the three subatomic particles and their charges.

2. MCQ:
Which particle determines the chemical element?
A) Electron
B) Proton
C) Neutron
D) Photon

3. Fill in the blank:
The number of protons in an atom is called the _____ number.

4. True/False:
Isotopes are atoms of the same element with different numbers of protons. (True/False)

5. Word Problem:
Carbon-12 and Carbon-14 are both carbon atoms but have different masses. If Carbon-12 has 6 protons and 6 neutrons, how many neutrons does Carbon-14 have? What are these variants called?

6. Conceptual Question:
If atoms are mostly empty space (nucleus is tiny compared to atom size), why do solid objects feel solid and not let other objects pass through them?`;
            }
            
            // Mathematics - Algebra
            if (lower.includes('equation') || lower.includes('algebra') || lower.includes('solve')) {
                return `Topic: Solving Linear Equations

1. Direct Question:
Solve for x: 2x + 5 = 15

2. MCQ:
What is the value of x in the equation 3x - 6 = 12?
A) 4
B) 6
C) 8
D) 18

3. Fill in the blank:
To solve an equation, you must perform the same operation on _____ sides of the equation.

4. True/False:
The equation 2x + 3 = 2x + 5 has no solution. (True/False)

5. Word Problem:
Ravi bought 5 notebooks and paid ₹50. If each notebook costs the same, write an equation to find the cost of one notebook and solve it.

6. Conceptual Question:
Why do we need to flip the inequality sign when multiplying or dividing by a negative number? Explain with an example.`;
            }
            
            // General Knowledge
            if (lower.includes('capital') || lower.includes('country')) {
                return `Topic: World Capitals

1. Direct Question:
What is the capital of France?

2. MCQ:
Which of these is the capital of Japan?
A) Beijing
B) Seoul
C) Tokyo
D) Bangkok

3. Fill in the blank:
The capital of India is _____.

4. True/False:
Sydney is the capital of Australia. (True/False)

5. Word Problem:
A traveler wants to visit the capitals of three countries: UK, Germany, and Italy. Name the three cities they should plan to visit.

6. Conceptual Question:
Why do you think some countries have capital cities that are not their largest cities? Give one example and a possible reason.`;
            }
            
            // Default template for any topic
            return `Topic: ${topic}

1. Direct Question:
What is ${topic} and why is it important?

2. MCQ:
Which of the following best describes ${topic}?
A) A complex theoretical concept
B) A practical application in daily life
C) A fundamental principle
D) An advanced technique

3. Fill in the blank:
Understanding ${topic} is essential for _____.

4. True/False:
${topic} is only relevant for advanced students. (True/False)

5. Word Problem:
Give a real-life example where understanding ${topic} would be helpful. Explain the scenario.

6. Conceptual Question:
How does ${topic} relate to other concepts in this subject? Explain the connection.`;
        },

        // Error response
        getErrorResponse() {
            return `Please provide a topic to generate questions.

Examples:
• "Arrays in programming"
• "Newton's laws"
• "2+2"
• "Photosynthesis"
• "World War 2"

Enter any concept and I'll create 6 types of questions for you!`;
        },

        // UI Integration - Add to chatbot
        initChatbotIntegration() {
            // Wait for chatbot to be ready
            const checkAndAdd = () => {
                const input = document.getElementById('chatbot-input');
                if (!input) {
                    setTimeout(checkAndAdd, 500);
                    return;
                }

                // Add command hint
                const placeholder = input.placeholder;
                input.addEventListener('focus', () => {
                    if (input.placeholder === 'Ask me anything...') {
                        input.placeholder = 'Try: "Generate questions about arrays"';
                    }
                });

                input.addEventListener('blur', () => {
                    input.placeholder = placeholder;
                });
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkAndAdd);
            } else {
                checkAndAdd();
            }
        }
    };

    // Expose globally
    window.QuestionGeneratorAI = QuestionGeneratorAI;

    // Auto-init integration
    QuestionGeneratorAI.initChatbotIntegration();
})();