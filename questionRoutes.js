// ==========================================
// QUESTION ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const { 
    getQuestions, 
    getSubjects, 
    getQuestionById,
    createQuestion 
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getQuestions);
router.get('/subjects', getSubjects);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);

module.exports = router;
