const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/:userId', reportsController.getReport);
router.get('/:userId/export', reportsController.exportCSV);

module.exports = router;
