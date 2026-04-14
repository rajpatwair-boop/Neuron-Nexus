// ==========================================
// GAME CONTROLLER
// ==========================================

const User = require('../models/User');
const Question = require('../models/Question');

// @desc    Submit answer and update XP/progress
// @route   POST /api/game/submit-answer
// @access  Private
const submitAnswer = async (req, res) => {
    try {
        const { questionId, selectedOption, timeTaken } = req.body;

        // Get question
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if answer is correct
        const isCorrect = selectedOption === question.correct;

        // Get user
        const user = await User.findById(req.user.id);

        // Update progress
        await user.updateProgress(question.subject, isCorrect);

        // Add XP if correct
        let xpGained = 0;
        let leveledUp = false;
        let oldLevel = user.level;

        if (isCorrect) {
            xpGained = question.xpReward;
            
            // Bonus XP for fast answers (if answered in less than 5 seconds)
            if (timeTaken && timeTaken < 5000) {
                xpGained += 5; // Speed bonus
            }

            await user.addXP(xpGained);
            
            // Check if user leveled up
            if (user.level > oldLevel) {
                leveledUp = true;
            }
        }

        res.json({
            success: true,
            data: {
                correct: isCorrect,
                correctAnswer: question.correct,
                explanation: question.explanation,
                xpGained,
                leveledUp,
                currentLevel: user.level,
                currentXP: user.xp,
                progress: user.progress
            }
        });

    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting answer'
        });
    }
};

// @desc    Get user progress
// @route   GET /api/game/progress
// @access  Private
const getProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: {
                level: user.level,
                xp: user.xp,
                xpToNextLevel: (user.level * 100) - user.xp,
                progress: user.progress,
                battleStats: user.battleStats
            }
        });

    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress'
        });
    }
};

// @desc    Submit battle result
// @route   POST /api/game/battle-result
// @access  Private
const submitBattleResult = async (req, res) => {
    try {
        const { result, playerScore, opponentScore } = req.body;
        // result: 'win', 'loss', or 'draw'

        const user = await User.findById(req.user.id);
        
        // Update battle stats
        await user.updateBattleStats(result);

        // Award XP based on result
        let xpGained = 0;
        if (result === 'win') xpGained = 50;
        else if (result === 'draw') xpGained = 25;
        else xpGained = 10; // Loss - participation XP

        await user.addXP(xpGained);

        res.json({
            success: true,
            data: {
                result,
                xpGained,
                battleStats: user.battleStats,
                currentLevel: user.level,
                currentXP: user.xp
            }
        });

    } catch (error) {
        console.error('Battle result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving battle result'
        });
    }
};

// @desc    Get AI opponent score (simulated)
// @route   GET /api/game/opponent-score
// @access  Private
const getOpponentScore = async (req, res) => {
    try {
        // Simulate AI opponent score (random between 0-5 for demo)
        // In production, this could be based on difficulty level
        const difficulty = req.query.difficulty || 'medium';
        
        let maxScore;
        switch(difficulty) {
            case 'easy': maxScore = 3; break;
            case 'hard': maxScore = 5; break;
            default: maxScore = 4; // medium
        }

        const opponentScore = Math.floor(Math.random() * (maxScore + 1));

        res.json({
            success: true,
            data: {
                opponentScore,
                opponentName: `AI Bot ${Math.floor(Math.random() * 1000)}`,
                difficulty
            }
        });

    } catch (error) {
        console.error('Opponent score error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating opponent'
        });
    }
};

module.exports = {
    submitAnswer,
    getProgress,
    submitBattleResult,
    getOpponentScore
};
