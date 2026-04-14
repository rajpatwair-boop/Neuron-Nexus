# 🎓 NeuroQuest AI - Academic Learning Platform

> An intelligent, offline-capable academic chatbot trained to teach students from Nursery to Class 10 across all subjects.

## 🌟 Features

### 🧠 AI Chatbot System
- ✅ **100% Offline** - No API calls required
- ✅ **Manually Trained** - You control all knowledge
- ✅ **Multi-Subject** - Math, Science, English, Coding, GK
- ✅ **Multi-Level** - Nursery to Class 10
- ✅ **Math Solver** - Automatic step-by-step solutions
- ✅ **Code Examples** - Programming in C, Python, Java, C++
- ✅ **Memory System** - Remembers conversations
- ✅ **Continuous Learning** - Improves over time

### 📚 Knowledge Base
- **Mathematics:** 35+ answers (Arithmetic to Algebra)
- **Science:** 25+ answers (Physics, Chemistry, Biology)
- **English:** 20+ answers (Grammar, Literature)
- **Programming:** 21+ code examples
- **General Knowledge:** 15+ answers

### 🎯 Smart Features
- Intent detection for instant responses
- Subject & level auto-detection
- Pattern-based generalization
- Unanswered question tracking
- Training dashboard for easy knowledge addition

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/neon-nexus.git
cd neon-nexus
```

### 2. Open in Browser
```bash
# Main Application
open index.html

# Training Dashboard
open training-dashboard.html

# Test Page
open test-intent-chatbot.html
```

### 3. Start Using
- Open `index.html` in your browser
- Click the chatbot icon (bottom right)
- Ask academic questions!

---

## 📁 Project Structure

```
neon-nexus/
├── index.html                      # Main application
├── training-dashboard.html         # Visual training interface
├── test-intent-chatbot.html        # Intent testing page
│
├── js/
│   ├── academic-knowledge-base.js  # Trained knowledge (EDIT THIS!)
│   ├── academic-chatbot-engine.js  # Chatbot brain engine
│   │
│   └── features/
│       ├── intent-chatbot.js       # Intent detection system
│       ├── ai-chatbot-pro.js       # Main chatbot integration
│       └── [other features...]
│
├── css/                            # Stylesheets
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── ...
│
└── README.md                       # This file
```

---

## 🎓 Training Your Chatbot

### Method 1: Training Dashboard (Easiest)

1. Open `training-dashboard.html`
2. Fill in the form:
   - **Subject:** Math/Science/English/Coding/GK
   - **Level:** Nursery-2, Class 3-5, Class 6-8, Class 9-10
   - **Question:** e.g., "what is photosynthesis"
   - **Answer:** Your detailed explanation
3. Click "Add to Knowledge Base"
4. Done! ✅

### Method 2: Direct Code Editing

Edit `js/academic-knowledge-base.js`:

```javascript
const ACADEMIC_KNOWLEDGE_BASE = {
    science: {
        elementary_3_to_5: {
            "what is photosynthesis": "Plants make food using sunlight, water, CO₂.",
            
            "what is gravity": "Gravity is the force that pulls things down.",
            
            // Add more here...
        }
    }
};
```

---

## 💡 Usage Examples

### Mathematics
```
User: "what is 3 plus 4"
Bot: "Step 1: Take 3
      Step 2: Add 4
      Final Answer: 7"

User: "solve x plus 7 equals 15"
Bot: "Step 1: Subtract 7
      x = 8"
```

### Science
```
User: "what is photosynthesis"
Bot: "Plants make food using sunlight, water, CO₂."

User: "what is atom"
Bot: "Smallest unit of matter."
```

### English
```
User: "what is noun"
Bot: "A noun is a naming word.
      Example: Dog, city, Rahul"

User: "what is verb"
Bot: "A verb is an action word.
      Example: run, eat"
```

### Programming
```
User: "print hello world in python"
Bot: "Explanation:
      This prints Hello World.
      
      Code:
      print("Hello World")"

User: "check even or odd in python"
Bot: "Code:
      num = 5
      if num % 2 == 0:
          print("Even")
      else:
          print("Odd")"
```

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Storage:** localStorage (Browser)
- **Architecture:** Modular, Offline-first
- **No Dependencies:** Pure vanilla JavaScript
- **No Build Tools:** Runs directly in browser

---

## 📊 Knowledge Base Structure

```javascript
{
  SUBJECT: {                    // math, science, english, coding, gk
    LEVEL: {                    // nursery_to_2, elementary_3_to_5, 
                                // middle_6_to_8, high_9_to_12
      "QUESTION": "ANSWER"
    }
  }
}
```

### Education Levels
- `nursery_to_2` - Nursery to Class 2 (Ages 4-7)
- `elementary_3_to_5` - Class 3 to 5 (Ages 8-10)
- `middle_6_to_8` - Class 6 to 8 (Ages 11-13)
- `high_9_to_12` - Class 9 to 12 (Ages 14-17)

---

## 🎯 Supported Subjects

### 📐 Mathematics
- Arithmetic (Addition, Subtraction, Multiplication, Division)
- Algebra (Equations, Variables)
- Geometry (Pythagoras Theorem)
- Advanced (Quadratic, Derivatives, Integration)

### 🔬 Science
- **Physics:** Gravity, Force, Motion, Newton's Laws, Electricity
- **Chemistry:** Atoms, Molecules, Periodic Table, Reactions
- **Biology:** Cells, Photosynthesis, DNA, Ecosystem

### 📝 English
- Grammar (Nouns, Verbs, Adjectives, Adverbs)
- Tenses (Past, Present, Future)
- Figures of Speech (Simile, Metaphor)
- Voice (Active, Passive)

### 💻 Programming
- **Languages:** C, Python, Java, C++
- **Concepts:** Variables, Loops, Functions, Arrays, OOP
- **Problems:** Patterns, Searching, Sorting
- **Skills:** Error Fixing, Debugging

### 🌍 General Knowledge
- History (World Wars, Independence)
- Geography (Countries, Capitals, Latitude)
- Civics (Democracy, Constitution)
- Science Facts (Solar System, Human Body)

---

## 🧪 Testing

### Test Chatbot Responses
```bash
open test-intent-chatbot.html
```

### Test Training Dashboard
```bash
open training-dashboard.html
```

### Console Commands
```javascript
// Get statistics
window.academicBot.getStats();

// View unanswered questions
window.academicBot.getUnansweredQuestions(10);

// Test response
window.academicBot.getResponse("what is gravity");

// Add knowledge programmatically
window.academicBot.addKnowledge('math', 'nursery_to_2', 'what is 3+3', '3+3=6');
```

---

## 📈 Statistics

After training, view your chatbot's stats:

```javascript
{
  totalConversations: 45,
  unansweredQuestions: 12,
  subjectBreakdown: {
    math: 20,
    science: 15,
    english: 10
  },
  memorySize: 45
}
```

---

## 🔄 How It Works

### Response Flow
```
User Question
    ↓
1. Intent Check (greetings, thanks, etc.)
    ↓ (if no match)
2. Knowledge Base Search
    ↓ (if no match)
3. Math Solver (automatic)
    ↓ (if no match)
4. Store in Unanswered Questions
    ↓
5. Return Helpful Fallback
```

### Learning Cycle
```
1. User asks question
2. If not in knowledge base → Stored
3. You review unanswered questions
4. You add answer via Training Dashboard
5. Chatbot now knows the answer! ✅
```

---

## 🎨 Customization

### Add New Subject
```javascript
const ACADEMIC_KNOWLEDGE_BASE = {
    // Existing subjects...
    
    history: {  // NEW SUBJECT
        middle_6_to_8: {
            "what is world war 1": "World War I (1914-1918)...",
        }
    }
};
```

### Add New Level
```javascript
math: {
    college_level: {  // NEW LEVEL
        "what is linear algebra": "Linear algebra studies...",
    }
}
```

### Change Response Style
Edit responses in `academic-knowledge-base.js` to match your teaching style.

---

## 🐛 Troubleshooting

### Chatbot not responding?
1. Check browser console for errors (F12)
2. Verify all scripts are loaded in `index.html`
3. Ensure `academic-knowledge-base.js` loads before `academic-chatbot-engine.js`

### Answer not found?
1. Check if question exists in knowledge base
2. Try rephrasing (use "what is..." format)
3. Check Training Dashboard for exact question format

### Reset memory?
```javascript
localStorage.removeItem('neuroquest_academic_memory');
localStorage.removeItem('neuroquest_unanswered_questions');
location.reload();
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Add Knowledge:** More subjects, levels, questions
2. **Improve Responses:** Better explanations, examples
3. **Add Features:** New capabilities, better UI
4. **Fix Bugs:** Report or fix issues

### How to Contribute
```bash
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
```

---

## 📞 Support

### Common Questions

**Q: Do I need an internet connection?**  
A: No! The chatbot works 100% offline.

**Q: Can I add my own answers?**  
A: Yes! Use the Training Dashboard or edit the knowledge base file.

**Q: What subjects are supported?**  
A: Math, Science, English, Programming, and General Knowledge.

**Q: Can it solve math problems?**  
A: Yes! It has a built-in math solver for arithmetic.

**Q: How do I improve the chatbot?**  
A: Add more answers to the knowledge base. The more you train, the smarter it gets!

---

## 🌟 Key Features Highlight

### 1. Offline Academic Knowledge Base
- Pre-trained with 116+ academic answers
- Covers Nursery to Class 10
- 5 subjects: Math, Science, English, Coding, GK
- Easy to expand

### 2. Smart Intent Detection
- Instant responses for greetings
- Handles thanks, goodbye, help
- No API calls needed

### 3. Math Solver Engine
- Automatic arithmetic solving
- Step-by-step solutions
- Supports +, -, ×, ÷
- No training needed for basic math

### 4. Training Dashboard
- Visual interface
- View unanswered questions
- Add knowledge easily
- Test chatbot in real-time

### 5. Memory System
- Remembers last 50 conversations
- Stores unanswered questions
- Learns from usage
- Tracks subject patterns

### 6. Code Examples
- Working code in C, Python, Java, C++
- Basic to intermediate programs
- Loops, Conditions, Arrays, Strings
- Searching & Sorting algorithms

---

## 🚀 Get Started Now!

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/neon-nexus.git

# 2. Open
cd neon-nexus
open index.html

# 3. Train
open training-dashboard.html

# 4. Test
Ask your chatbot any academic question!
```

---

## 🎓 Example Training Session

**Step 1:** User asks "what is mitosis"

**Step 2:** Chatbot: "I'm still learning about this topic..."

**Step 3:** Question saved to "Unanswered Questions"

**Step 4:** You open Training Dashboard

**Step 5:** Click "Train Now" on "what is mitosis"

**Step 6:** Add answer:
```
Subject: Science
Level: Class 9-10
Question: what is mitosis
Answer: Mitosis is cell division that creates two identical cells.

Steps:
1. Prophase - Chromosomes condense
2. Metaphase - Chromosomes align
3. Anaphase - Chromosomes separate
4. Telophase - Two nuclei form

Result: 1 cell → 2 identical cells!
```

**Step 7:** Next time, chatbot knows! 🎉

---

## 📊 Current Knowledge Base

| Subject | Answers | Levels |
|---------|---------|--------|
| Mathematics | 35+ | Nursery to Class 12 |
| Science | 25+ | Nursery to Class 10 |
| English | 20+ | Nursery to Class 10 |
| Programming | 21+ | Class 6 to 10 |
| General Knowledge | 15+ | Nursery to Class 10 |
| **Total** | **116+** | **All Levels** |

---

## 🎯 Roadmap

- [ ] Add more subjects (History, Economics, Art)
- [ ] Voice input/output support
- [ ] Multi-language support
- [ ] Advanced math (Calculus, Statistics)
- [ ] Interactive quizzes
- [ ] Progress tracking
- [ ] Mobile app version

---

## 💬 Feedback

Found a bug? Have a suggestion? Want to request a feature?

- **Report Bug:** Open an Issue
- **Request Feature:** Open an Issue
- **Contact:** Create a Discussion

---

## 🙏 Acknowledgments

- Built for students who need accessible learning
- Designed for teachers who want to share knowledge
- Created for anyone passionate about education

---

## ⭐ Star This Repo!

If you found this project helpful, please give it a star! ⭐

It helps others discover this free educational tool.

---

**Made with ❤️ for Education**

📚 **Learn. Train. Teach.** 🎓
