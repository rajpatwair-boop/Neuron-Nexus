// ==========================================
// QUESTION CONTROLLER
// ==========================================

const Question = require('../models/Question');

// @desc    Get questions by subject and difficulty
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
    try {
        const { 
            subject, 
            difficulty = 'medium', 
            academicLevel = 'School',
            limit = 5 
        } = req.query;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        // Get random questions using aggregation
        const questions = await Question.getRandomQuestions(
            subject,
            difficulty,
            academicLevel,
            parseInt(limit)
        );

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No questions found for ${subject} (${difficulty})`
            });
        }

        // Format questions (exclude correct answer for client)
        const formattedQuestions = questions.map(q => ({
            id: q._id,
            question: q.question,
            options: q.options,
            subject: q.subject,
            difficulty: q.difficulty,
            xpReward: q.xpReward
            // Note: correct answer is NOT sent to client
        }));

        res.json({
            success: true,
            count: formattedQuestions.length,
            data: formattedQuestions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions'
        });
    }
};

// @desc    Get all subjects
// @route   GET /api/questions/subjects
// @access  Private
const getSubjects = async (req, res) => {
    try {
        const subjects = await Question.distinct('subject');
        
        res.json({
            success: true,
            data: subjects
        });

    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subjects'
        });
    }
};

// @desc    Get question by ID (admin only - includes answer)
// @route   GET /api/questions/:id
// @access  Private (Admin)
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            data: question
        });

    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching question'
        });
    }
};

// @desc    Create new question (admin)
// @route   POST /api/questions
// @access  Private (Admin)
const createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: question
        });

    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating question'
        });
    }
};

module.exports = {
    getQuestions,
    getSubjects,
    getQuestionById,
    createQuestion
};
