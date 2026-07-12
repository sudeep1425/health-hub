const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateDietLog } = require('../middleware/validate');

router.use(authMiddleware);

router.get('/summary', dietController.getTodaySummary);
router.get('/:userId', dietController.getAll);
router.post('/', validateDietLog, dietController.create);
router.put('/:id', validateDietLog, dietController.update);
router.delete('/:id', dietController.delete);

module.exports = router;
