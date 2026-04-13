/**
 * NeuroQuest Academic Knowledge Base
 * Manual Training System - Add your own answers here!
 * 
 * HOW TO USE:
 * 1. Find the subject category below
 * 2. Add questions and answers
 * 3. Chatbot will instantly use your trained answers
 * 
 * FORMAT:
 * "question_keywords": "your_answer_here"
 */

const ACADEMIC_KNOWLEDGE_BASE = {
    
    // ==========================================
    // MATHEMATICS
    // ==========================================
    math: {
        // Basic Arithmetic (Nursery - Class 2)
        nursery_to_2: {
            "what is 1 plus 1": "Step 1: Take 1\nStep 2: Add 1\nFinal Answer: 2",
            "what is 2 plus 2": "Step 1: Take 2\nStep 2: Add 2\nFinal Answer: 4",
            "what is 3 plus 4": "Step 1: Take 3\nStep 2: Add 4\nFinal Answer: 7",
            "what is 5 minus 3": "Step 1: Take 5\nStep 2: Subtract 3\nFinal Answer: 2",
            "what is 8 minus 3": "Step 1: Take 8\nStep 2: Subtract 3\nFinal Answer: 5",
            "count from 1 to 10": "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
            "what is counting": "Counting means saying numbers in order.",
            "what is addition": "Addition means adding numbers.",
            "what is subtraction": "Subtraction means taking away.",
            "what is alphabet": "Alphabet is a set of letters from A to Z.",
            "what is vowel": "Vowels are A, E, I, O, U.",
            "what is consonant": "Letters other than vowels are consonants.",
            "what is a word": "A word is a group of letters that has meaning.",
            "what is sentence": "A sentence is a group of words that makes sense.",
            "what is animal": "Animals are living beings that can move.",
            "what is plant": "Plants grow in soil and need water and sunlight."
        },
        
        // Elementary (Class 3-5)
        elementary_3_to_5: {
            "what is multiplication": "Multiplication is repeated addition.",
            "what is 5 times 4": "Step: 5 + 5 + 5 + 5\nFinal Answer: 20",
            "what is 5 multiplied by 4": "Step: 5 + 5 + 5 + 5\nFinal Answer: 20",
            "what is division": "Division means equal sharing.",
            "what is 20 divided by 5": "Final Answer: 4",
            "what is 20 ÷ 5": "Final Answer: 4",
            "what is fraction": "A fraction shows part of whole.",
            "what is 1/2": "One out of two equal parts.",
            "what is a half": "One out of two equal parts.",
            "table of 2": "2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10, 2×6=12, 2×7=14, 2×8=16, 2×9=18, 2×10=20",
            "table of 5": "5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25, 5×6=30, 5×7=35, 5×8=40, 5×9=45, 5×10=50",
            "what is the sun": "The sun gives light and heat.",
            "what is air": "Air is what we breathe.",
            "what is water cycle": "Water changes form and moves in nature."
        },
        
        // Middle School (Class 6-8)
        middle_6_to_8: {
            "what is integer": "Whole numbers including negative numbers.",
            "what is rational number": "Number written as p/q.",
            "solve x plus 7 equals 15": "Step 1: Subtract 7\nx = 8",
            "what is area of square": "side × side",
            "what is perimeter": "Total boundary length.",
            "what is photosynthesis": "Plants make food using sunlight, water, CO₂.",
            "what is force": "Force is push or pull.",
            "what is friction": "Friction opposes motion.",
            "what is motion": "Change in position.",
            "what is algebra": "Algebra uses letters to represent unknown numbers.",
            "what is equation": "An equation is a mathematical statement showing two things are equal.",
            "pythagoras theorem": "Pythagoras Theorem (for right triangles): a² + b² = c²\n\nWhere:\n- a and b are the two shorter sides\n- c is the longest side (hypotenuse)\n\nExample: If a = 3, b = 4\n3² + 4² = 9 + 16 = 25\nSo c = √25 = 5",
            "what is percentage": "Percentage means 'per 100'.\n\nExample: 50% means 50 out of 100\n50% = 50/100 = 0.5 = 1/2\n\nTo find 25% of 200:\n25/100 × 200 = 50"
        },
        
        // High School (Class 9-10)
        high_9_to_12: {
            "what is quadratic equation": "ax² + bx + c = 0",
            "solve x squared minus 9 equals 0": "x = ±3",
            "solve x² - 9 = 0": "x = ±3",
            "what is trigonometry": "Study of triangle angles and sides.",
            "what is probability": "Chance of event.",
            "what is derivative": "Derivative measures the rate of change.",
            "what is integration": "Integration is the reverse of differentiation. It finds the area under a curve."
        }
    },
    
    // ==========================================
    // SCIENCE
    // ==========================================
    science: {
        // Basic Science (Nursery - Class 2)
        nursery_to_2: {
            "what is water": "Water is what we drink and need to live.",
            "what is sun": "The sun gives light and heat.",
            "what are plants": "Plants grow in soil and need water and sunlight.",
            "what is animal": "Animals are living beings that can move."
        },
        
        // Elementary Science (Class 3-5)
        elementary_3_to_5: {
            "what is photosynthesis": "Plants make food using sunlight, water, CO₂.",
            "what is gravity": "Gravity is the force that pulls things down.",
            "what is the sun": "The sun gives light and heat.",
            "what is air": "Air is what we breathe.",
            "what is water cycle": "Water changes form and moves in nature.",
            "states of matter": "Matter exists in 3 states: Solid, Liquid, and Gas."
        },
        
        // Middle School Science (Class 6-8)
        middle_6_to_8: {
            "what is atom": "Smallest unit of matter.",
            "what is cell": "A cell is the basic unit of life.",
            "what is force": "Force is push or pull.",
            "what is friction": "Friction opposes motion.",
            "what is motion": "Change in position.",
            "what is photosynthesis": "Plants make food using sunlight, water, CO₂.",
            "newton laws": "Newton's Three Laws of Motion:\n\n1st Law: Object stays at rest or in motion unless acted upon by a force.\n\n2nd Law: Force = mass × acceleration (F = ma)\n\n3rd Law: Every action has an equal and opposite reaction."
        },
        
        // High School Science (Class 9-10)
        high_9_to_12: {
            "what is atom": "Smallest unit of matter.",
            "what is molecule": "Group of atoms.",
            "what is electricity": "Flow of electric charge.",
            "what is ohm's law": "V = IR\n\nWhere:\nV = Voltage\nI = Current\nR = Resistance",
            "what is newton's first law": "Object stays at rest or motion unless force acts.",
            "what is ecosystem": "Living + non-living interaction.",
            "what is dna": "DNA contains genetic instructions for all living organisms.",
            "what is periodic table": "The Periodic Table organizes all elements.",
            "what is chemical reaction": "A chemical reaction transforms substances."
        }
    },
    
    // ==========================================
    // ENGLISH
    // ==========================================
    english: {
        // Basic English (Nursery - Class 2)
        nursery_to_2: {
            "what is alphabet": "Alphabet is a set of letters from A to Z.",
            "what is vowel": "Vowels are A, E, I, O, U.",
            "what is consonant": "Letters other than vowels are consonants.",
            "what is a word": "A word is a group of letters that has meaning.",
            "what is sentence": "A sentence is a group of words that makes sense."
        },
        
        // Elementary English (Class 3-5)
        elementary_3_to_5: {
            "what is noun": "A noun is a naming word.\nExample: Dog, city, Rahul",
            "what is pronoun": "A pronoun replaces a noun.\nExample: he, she, it",
            "what is verb": "A verb is an action word.\nExample: run, eat",
            "what is adjective": "It describes a noun.\nExample: big, red",
            "what is adverb": "An adverb describes HOW an action is done.\n\nIt modifies verbs, adjectives, or other adverbs.\n\nExample: quickly, very, carefully",
            "what is sentence": "A sentence is a group of words that makes complete sense."
        },
        
        // Middle School English (Class 6-8)
        middle_6_to_8: {
            "what is tense": "Tense shows WHEN an action happens!\n\n1. PRESENT TENSE (happening now): I eat breakfast.\n\n2. PAST TENSE (already happened): I ate breakfast.\n\n3. FUTURE TENSE (will happen): I will eat breakfast.",
            "what is simile": "A simile compares two things using 'like' or 'as'!\n\nExamples:\n- As brave AS a lion\n- Runs LIKE the wind",
            "what is metaphor": "A metaphor directly says one thing IS another!\n\nExamples:\n- He IS a lion in battle (means he's brave)\n- Time IS money (means time is valuable)",
            "what is active passive voice": "ACTIVE VOICE: Subject does the action\n- The cat caught the mouse.\n\nPASSIVE VOICE: Subject receives the action\n- The mouse was caught by the cat."
        },
        
        // High School English (Class 9-10)
        high_9_to_12: {
            "what is active passive voice": "ACTIVE VOICE: Subject does the action\n- The cat caught the mouse.\n\nPASSIVE VOICE: Subject receives the action\n- The mouse was caught by the cat.\n\nConversion rules:\n1. Object becomes subject\n2. Add appropriate form of 'be' verb\n3. Use past participle of main verb"
        }
    },
    
    // ==========================================
    // SOCIAL STUDIES / GK
    // ==========================================
    gk: {
        // Basic GK (Nursery - Class 2)
        nursery_to_2: {
            "india capital": "The capital of India is New Delhi.",
            "colors of rainbow": "A rainbow has 7 colors: VIBGYOR\n\nV - Violet\nI - Indigo\nB - Blue\nG - Green\nY - Yellow\nO - Orange\nR - Red"
        },
        
        // Elementary GK (Class 3-5)
        elementary_3_to_5: {
            "india independence": "India got independence on 15th August 1947.",
            "solar system planets": "Our Solar System has 8 planets:\n\n1. Mercury (closest)\n2. Venus\n3. Earth (our home)\n4. Mars\n5. Jupiter (largest)\n6. Saturn (has rings)\n7. Uranus\n8. Neptune (farthest)"
        },
        
        // Middle School GK (Class 6-8)
        middle_6_to_8: {
            "what is democracy": "People elect their leaders.",
            "what is latitude": "Imaginary horizontal lines on Earth.",
            "human body organs": "Major organs: Heart, Brain, Lungs, Liver, Kidneys, Stomach",
            "india geography": "India is in South Asia. Capital: New Delhi. 28 states."
        },
        
        // High School GK (Class 9-10)
        high_9_to_12: {
            "what is gdp": "Total value of goods in country.",
            "world war 2": "World War II (1939-1945)\n\nKey Facts:\n- Started: September 1, 1939\n- Ended: September 2, 1945\n- Main Allies: USA, UK, USSR, France\n- Main Axis: Germany, Italy, Japan",
            "indian constitution": "Indian Constitution:\n\n- Adopted: November 26, 1949\n- Effective: January 26, 1950\n- Drafted by: Dr. B.R. Ambedkar"
        }
    },
    
    // ==========================================
    // COMPUTER SCIENCE / CODING
    // ==========================================
    coding: {
        // Basic Programs (Class 6-8)
        middle_6_to_8: {
            "print hello world in c": "Explanation:\nThis prints Hello World.\n\nCode:\n#include <stdio.h>\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
            
            "print hello world in python": "Explanation:\nThis prints Hello World.\n\nCode:\nprint(\"Hello World\")",
            
            "print hello world in java": "Explanation:\nThis prints Hello World.\n\nCode:\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
            
            "add two numbers in java": "Explanation:\nThis adds two numbers.\n\nCode:\nint a = 5;\nint b = 3;\nSystem.out.println(a + b);",
            
            "add two numbers in python": "Explanation:\nThis adds two numbers.\n\nCode:\na = 5\nb = 3\nprint(a + b)",
            
            "add two numbers in c": "Explanation:\nThis adds two numbers.\n\nCode:\n#include <stdio.h>\nint main() {\n    int a = 5, b = 3;\n    printf(\"%d\", a + b);\n    return 0;\n}",
            
            "what is programming": "Programming is giving instructions to computers.",
            
            "what is variable": "A variable stores data.\n\nExample:\nage = 15\nname = 'Rahul'",
            
            "what is loop": "A loop repeats code multiple times.",
            
            "what is array": "An array stores multiple values in one variable.\n\nExample:\nnumbers = [10, 20, 30, 40, 50]",
            
            "what is function": "A function is a reusable block of code.\n\nExample:\ndef greet(name):\n    return 'Hello, ' + name"
        },
        
        // Intermediate Programs (Class 9-10)
        high_9_to_12: {
            "print numbers 1 to 10 in python": "Explanation:\nLoop runs from 1 to 10.\n\nCode:\nfor i in range(1, 11):\n    print(i)",
            
            "print even numbers in c++": "Code:\nfor(int i=2;i<=10;i+=2){\n    cout<<i;\n}",
            
            "print even numbers in python": "Code:\nfor i in range(2, 11, 2):\n    print(i)",
            
            "check even or odd in python": "Code:\nnum = 5\nif num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
            
            "check even or odd in c": "Code:\nint num = 5;\nif(num % 2 == 0) {\n    printf(\"Even\");\n} else {\n    printf(\"Odd\");\n}",
            
            "find sum of array": "Code:\narr = [1,2,3,4]\nprint(sum(arr))",
            
            "find maximum in array": "Code:\narr = [1,5,3]\nprint(max(arr))",
            
            "find minimum in array": "Code:\narr = [1,5,3]\nprint(min(arr))",
            
            "reverse string in python": "Code:\ns = \"hello\"\nprint(s[::-1])",
            
            "check palindrome": "Code:\ns = \"madam\"\nif s == s[::-1]:\n    print(\"Palindrome\")",
            
            "function to add numbers": "Code:\ndef add(a,b):\n    return a+b",
            
            "print star pattern": "Code:\nfor i in range(1,6):\n    print(\"*\"*i)",
            
            "linear search": "Code:\narr = [1,2,3]\ntarget = 2\nfor i in arr:\n    if i == target:\n        print(\"Found\")",
            
            "bubble sort": "Code:\narr = [5,3,1]\nfor i in range(len(arr)):\n    for j in range(len(arr)-1):\n        if arr[j] > arr[j+1]:\n            arr[j], arr[j+1] = arr[j+1], arr[j]",
            
            "fix error print hello": "Explanation:\nMissing parentheses.\n\nCode:\nprint(\"Hello\")",
            
            "what is oop": "OOP (Object-Oriented Programming) organizes code using objects.\n\n4 Pillars:\n1. Encapsulation\n2. Inheritance\n3. Polymorphism\n4. Abstraction",
            
            "what is data structure": "A data structure organizes and stores data efficiently.\n\nTypes:\n- Arrays\n- Linked Lists\n- Stacks\n- Queues\n- Trees\n- Graphs",
            
            "what is algorithm": "An algorithm is a step-by-step procedure to solve a problem."
        }
    }
};

// Export for use in chatbot
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ACADEMIC_KNOWLEDGE_BASE;
}
