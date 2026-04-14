// ==========================================
// GAME ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const { 
    submitAnswer, 
    getProgress, 
    submitBattleResult,
    getOpponentScore 
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');
const { submitAnswerValidation } = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.post('/submit-answer', submitAnswerValidation, submitAnswer);
router.get('/progress', getProgress);
router.post('/battle-result', submitBattleResult);
router.get('/opponent-score', getOpponentScore);

module.exports = router;
