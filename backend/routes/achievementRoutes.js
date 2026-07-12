const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/:userId', achievementController.getAll);

module.exports = router;
