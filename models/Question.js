// ==========================================
// QUESTION MODEL
// ==========================================

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: {
            validator: function(v) {
                return v.length === 4; // Exactly 4 options
            },
            message: 'Question must have exactly 4 options'
        }
    },
    correct: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        min: 0,
        max: 3 // Index 0-3 for 4 options
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        enum: [
            'Mathematics',
            'Science',
            'Programming',
            'General Knowledge',
            'History',
            'Web Development'
        ]
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    academicLevel: {
        type: String,
        required: [true, 'Academic level is required'],
        enum: ['School', 'High School', 'College'],
        default: 'School'
    },
    category: {
        type: String,
        default: null // For sub-categories like 'Physics', 'Chemistry', etc.
    },
    xpReward: {
        type: Number,
        default: function() {
            // XP based on difficulty
            const xpMap = { easy: 10, medium: 20, hard: 30 };
            return xpMap[this.difficulty] || 10;
        }
    },
    explanation: {
        type: String,
        default: '' // Optional explanation for the answer
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for faster queries
questionSchema.index({ subject: 1, difficulty: 1, academicLevel: 1 });
questionSchema.index({ isActive: 1 });

// Static method to get random questions
questionSchema.statics.getRandomQuestions = async function(
    subject, 
    difficulty, 
    academicLevel, 
    limit = 5
) {
    return this.aggregate([
        {
            $match: {
                subject,
                difficulty,
                academicLevel,
                isActive: true
            }
        },
        { $sample: { size: limit } }
    ]);
};

// Static method to seed initial questions
questionSchema.statics.seedQuestions = async function() {
    const count = await this.countDocuments();
    if (count > 0) {
        console.log(`📚 ${count} questions already in database`);
        return;
    }

    const sampleQuestions = [
        // Mathematics - Easy
        {
            question: 'What is 15 + 27?',
            options: ['40', '41', '42', '43'],
            correct: 2,
            subject: 'Mathematics',
            difficulty: 'easy',
            academicLevel: 'School',
            xpReward: 10
        },
        {
            question: 'What is 8 × 7?',
            options: ['54', '56', '58', '48'],
            correct: 1,
            subject: 'Mathematics',
            difficulty: 'easy',
            academicLevel: 'School',
            xpReward: 10
        },
        // Science - Medium
        {
            question: 'What is the chemical symbol for gold?',
            options: ['Go', 'Gd', 'Au', 'Ag'],
            correct: 2,
            subject: 'Science',
            difficulty: 'medium',
            academicLevel: 'High School',
            xpReward: 20
        },
        // Programming - Medium
        {
            question: 'What does HTML stand for?',
            options: [
                'Hyper Text Markup Language',
                'High Tech Modern Language',
                'Hyper Transfer Markup Language',
                'Home Tool Markup Language'
            ],
            correct: 0,
            subject: 'Programming',
            difficulty: 'medium',
            academicLevel: 'High School',
            xpReward: 20
        },
        // General Knowledge
        {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Madrid', 'Paris'],
            correct: 3,
            subject: 'General Knowledge',
            difficulty: 'easy',
            academicLevel: 'School',
            xpReward: 10
        }
    ];

    await this.insertMany(sampleQuestions);
    console.log(`✅ Seeded ${sampleQuestions.length} sample questions`);
};

module.exports = mongoose.model('Question', questionSchema);
