const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');
const { validateLogin, validateAdminUser } = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many admin login attempts. Try again in 15 minutes.' },
});

router.post('/login', adminLoginLimiter, validateLogin, adminController.login);

// Protected admin routes
router.use(adminMiddleware);
router.get('/users', adminController.getUsers);
router.post('/users', validateAdminUser, adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/toggle', adminController.toggleUserStatus);
router.get('/stats', adminController.getStats);

module.exports = router;
