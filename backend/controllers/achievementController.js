const achievementModel = require('../models/achievementModel');

const achievementController = {
  async getAll(req, res, next) {
    try {
      const userId = req.params.userId;
      if (parseInt(userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const achievements = await achievementModel.getByUser(userId);
      return res.json({ achievements });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = achievementController;
