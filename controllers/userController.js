// ==========================================
// USER CONTROLLER
// ==========================================

const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, currentSubject } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (currentSubject !== undefined) updateData.currentSubject = currentSubject;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// @desc    Get user stats/leaderboard
// @route   GET /api/user/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ level: -1, xp: -1 })
            .limit(10)
            .select('name level xp progress.accuracy');

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard'
        });
    }
};

module.exports = { getProfile, updateProfile, getLeaderboard };
