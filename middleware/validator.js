// ==========================================
// INPUT VALIDATION MIDDLEWARE
// ==========================================

const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Signup validation
const signupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];

// Login validation
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Update user validation
const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('currentSubject')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Subject name too long'),
    handleValidationErrors
];

// Submit answer validation
const submitAnswerValidation = [
    body('questionId')
        .notEmpty().withMessage('Question ID is required')
        .isMongoId().withMessage('Invalid question ID'),
    body('selectedOption')
        .notEmpty().withMessage('Selected option is required')
        .isInt({ min: 0, max: 3 }).withMessage('Selected option must be 0-3'),
    body('timeTaken')
        .optional()
        .isInt({ min: 0 }).withMessage('Time taken must be a positive number'),
    handleValidationErrors
];

// Get questions validation
const getQuestionsValidation = [
    body('subject')
        .notEmpty().withMessage('Subject is required'),
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('academicLevel')
        .optional()
        .isIn(['School', 'High School', 'College']).withMessage('Invalid academic level'),
    handleValidationErrors
];

module.exports = {
    signupValidation,
    loginValidation,
    updateUserValidation,
    submitAnswerValidation,
    getQuestionsValidation,
    handleValidationErrors
};
