const dietModel = require('../models/dietModel');
const waterModel = require('../models/waterModel');
const achievementModel = require('../models/achievementModel');

const dietController = {
  async getAll(req, res, next) {
    try {
      const userId = req.params.userId;
      if (parseInt(userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const logs = await dietModel.getByUser(userId);
      return res.json({ logs });
    } catch (err) {
      next(err);
    }
  },

  async getTodaySummary(req, res, next) {
    try {
      const userId = req.user.id;
      const today = new Date().toISOString().split('T')[0];
      const [dietTotals, waterTotal, streak] = await Promise.all([
        dietModel.getDailyTotals(userId, today),
        waterModel.getDailyTotal(userId, today),
        dietModel.getStreakDays(userId),
      ]);
      return res.json({
        calories: parseInt(dietTotals.total_calories, 10),
        meals_count: parseInt(dietTotals.meals_count, 10),
        water_ml: parseInt(waterTotal.total_ml, 10),
        streak,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { food_name, calories, meal_type, log_date } = req.body;
      const log = await dietModel.create({ user_id: userId, food_name, calories, meal_type, log_date });

      // Check achievements after new entry
      const today = log.log_date;
      const [dailyTotals, waterTotal, streak, totalMeals, allLogs] = await Promise.all([
        dietModel.getDailyTotals(userId, today),
        waterModel.getDailyTotal(userId, today),
        dietModel.getStreakDays(userId),
        dietModel.getTotalMealsCount(userId),
        dietModel.getByUser(userId),
      ]);

      const newlyEarned = await achievementModel.checkAndAward(userId, {
        dailyWaterMl: parseInt(waterTotal.total_ml, 10),
        streak,
        totalMeals,
        mealEntries: allLogs.length,
      });

      return res.status(201).json({
        log,
        summary: {
          calories: parseInt(dailyTotals.total_calories, 10),
          meals_count: parseInt(dailyTotals.meals_count, 10),
          water_ml: parseInt(waterTotal.total_ml, 10),
          streak,
        },
        newAchievements: newlyEarned,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { food_name, calories, meal_type, log_date } = req.body;
      const log = await dietModel.update(id, userId, { food_name, calories, meal_type, log_date });
      if (!log) return res.status(404).json({ error: 'Log not found' });
      return res.json({ log });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const deleted = await dietModel.delete(id, userId);
      if (!deleted) return res.status(404).json({ error: 'Log not found' });
      return res.json({ message: 'Log deleted', id: deleted.id });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dietController;
