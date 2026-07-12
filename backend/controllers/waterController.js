const waterModel = require('../models/waterModel');
const dietModel = require('../models/dietModel');
const achievementModel = require('../models/achievementModel');

const waterController = {
  async getAll(req, res, next) {
    try {
      const userId = req.params.userId;
      if (parseInt(userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const logs = await waterModel.getByUser(userId);
      return res.json({ logs });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { quantity_ml, log_date } = req.body;
      const log = await waterModel.create({ user_id: userId, quantity_ml, log_date });

      // Compute updated totals and check achievements
      const today = log.log_date;
      const [waterTotal, streak, totalMeals, allWater] = await Promise.all([
        waterModel.getDailyTotal(userId, today),
        dietModel.getStreakDays(userId),
        dietModel.getTotalMealsCount(userId),
        waterModel.getByUser(userId),
      ]);

      const newlyEarned = await achievementModel.checkAndAward(userId, {
        dailyWaterMl: parseInt(waterTotal.total_ml, 10),
        streak,
        totalMeals,
        waterEntries: allWater.length,
      });

      return res.status(201).json({
        log,
        dailyWaterMl: parseInt(waterTotal.total_ml, 10),
        newAchievements: newlyEarned,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const deleted = await waterModel.delete(id, userId);
      if (!deleted) return res.status(404).json({ error: 'Log not found' });
      return res.json({ message: 'Water log deleted', id: deleted.id });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = waterController;
