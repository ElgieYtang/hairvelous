/**
 * Validation Middleware
 * Location: backend/middleware/validation.js
 * Purpose: Reusable validation rules using express-validator
 */
const { body, param } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateForgotPassword = [
  body('email').trim().isEmail().normalizeEmail(),
];

const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateUpdateProfile = [
  body('name').optional().trim().isLength({ max: 200 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
];

const validateAssessment = [
  body('responses').isArray().withMessage('Responses must be an array'),
  body('responses.*.question').notEmpty().withMessage('Question is required'),
  body('responses.*.answer').notEmpty().withMessage('Answer is required'),
];

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('brand').optional().trim().isLength({ max: 100 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().trim(),

  // NEW fields
  body('imageUrl').optional({ nullable: true }).trim().isLength({ max: 500 }),

  body('expiryType')
    .optional()
    .isIn(['date', 'period_after_opening', 'not_applicable'])
    .withMessage('Invalid expiry type'),

  body('expiryDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Invalid expiry date'),

  body('expiryPeriodMonths')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 120 })
    .withMessage('Expiry period months must be between 1 and 120'),

  body('categories').optional().isArray(),
];

const validateGuide = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('steps').trim().notEmpty().withMessage('Steps are required'),
  body('category').optional().isIn(['mask', 'oil', 'rinse', 'growth']).withMessage('Invalid category'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('ingredients').optional().trim(),
  body('caution').optional().trim(),
];

const validateRoutineLog = [
  body('activityType').trim().notEmpty().withMessage('Activity type is required'),
  body('dateLogged').isISO8601().withMessage('Valid date is required'),
  body('notes').optional().trim(),
];

const validateUserId = [
  param('userId').isInt().withMessage('Invalid user ID'),
];

const validateProductId = [
  param('productId').isInt().withMessage('Invalid product ID'),
];

const validateAssessmentId = [
  param('assessmentId').isInt({ min: 1 }).withMessage('Invalid assessment ID'),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateAssessment,
  validateProduct,
  validateGuide,
  validateRoutineLog,
  validateUserId,
  validateProductId,
  validateAssessmentId,
};