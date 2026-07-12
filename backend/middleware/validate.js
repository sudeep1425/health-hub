const { body, validationResult } = require('express-validator');

// Reusable validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const validateDietLog = [
  body('food_name').trim().notEmpty().withMessage('Food name is required'),
  body('calories')
    .isInt({ min: 0, max: 10000 })
    .withMessage('Calories must be between 0 and 10000'),
  body('meal_type')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
  body('log_date').optional().isDate().withMessage('Invalid date'),
  handleValidation,
];

const validateWaterLog = [
  body('quantity_ml')
    .isInt({ min: 1, max: 5000 })
    .withMessage('Quantity must be between 1 and 5000 ml'),
  body('log_date').optional().isDate().withMessage('Invalid date'),
  handleValidation,
];

const validateAdminUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateDietLog,
  validateWaterLog,
  validateAdminUser,
};
