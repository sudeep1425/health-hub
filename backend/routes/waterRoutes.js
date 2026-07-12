const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateWaterLog } = require('../middleware/validate');

router.use(authMiddleware);

router.get('/:userId', waterController.getAll);
router.post('/', validateWaterLog, waterController.create);
router.delete('/:id', waterController.delete);

module.exports = router;
