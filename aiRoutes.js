/**
 * AI Question Generation Routes
 * Secure API endpoints for dynamic question generation
 */

const express = require('express');
const router = express.Router();
const { generateQuestion, getQuestionBatch } = require('../services/aiQuestionService');
const difficultyTracker = require('../services/difficultyService');
const { protect: auth } = require('../middleware/auth');

/**
 * @route   POST /api/ai/question
 * @desc    Generate a single AI question
 * @access  Private
 */
router.post('/question', auth, async (req, res) => {
    try {
        const { domain, difficulty: requestedDifficulty } = req.body;
        const userId = req.user.id;

        // Use adaptive difficulty if not specified
        const difficulty = requestedDifficulty || difficultyTracker.getCurrentDifficulty(userId);

        // Generate question
        const question = await generateQuestion(domain, difficulty);

        res.json({
            success: true,
            data: question,
            meta: {
                domain,
                difficulty,
                source: question.source
            }
        });
    } catch (error) {
        console.error('Question generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate question',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ai/question-batch
 * @desc    Generate multiple questions
 * @access  Private
 */
router.post('/question-batch', auth, async (req, res) => {
    try {
        const { domain, count = 5 } = req.body;
        const userId = req.user.id;
        const difficulty = difficultyTracker.getCurrentDifficulty(userId);

        const questions = await getQuestionBatch(domain, difficulty, count);

        res.json({
            success: true,
            data: questions,
            meta: {
                domain,
                difficulty,
                count: questions.length
            }
        });
    } catch (error) {
        console.error('Batch generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate questions',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ai/answer
 * @desc    Submit answer and get feedback
 * @access  Private
 */
router.post('/answer', auth, async (req, res) => {
    try {
        const { questionId, selectedAnswer, correctAnswer, explanation, domain } = req.body;
        const userId = req.user.id;

        const isCorrect = selectedAnswer === correctAnswer;

        // Update difficulty based on performance
        const difficultyUpdate = difficultyTracker.recordAnswer(userId, isCorrect, domain);

        res.json({
            success: true,
            data: {
                correct: isCorrect,
                correctAnswer,
                explanation,
                difficulty: difficultyUpdate
            }
        });
    } catch (error) {
        console.error('Answer submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process answer',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/ai/difficulty
 * @desc    Get current difficulty for user
 * @access  Private
 */
router.get('/difficulty', auth, (req, res) => {
    try {
        const userId = req.user.id;
        const difficulty = difficultyTracker.getCurrentDifficulty(userId);
        const stats = difficultyTracker.getStats(userId);

        res.json({
            success: true,
            data: {
                currentDifficulty: difficulty,
                stats
            }
        });
    } catch (error) {
        console.error('Difficulty fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get difficulty',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/ai/stats
 * @desc    Get user performance statistics
 * @access  Private
 */
router.get('/stats', auth, (req, res) => {
    try {
        const userId = req.user.id;
        const stats = difficultyTracker.getStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get stats',
            error: error.message
        });
    }
});

module.exports = router;