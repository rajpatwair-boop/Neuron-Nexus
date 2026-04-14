// ==========================================
// USER ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { updateUserValidation } = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/update', updateUserValidation, updateProfile);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
