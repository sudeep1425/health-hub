const pool = require('../config/db');

const ACHIEVEMENT_DEFINITIONS = [
  { title: 'First Sip', description: 'Log your first water intake', goal_type: 'water_entries', threshold: 1 },
  { title: 'Hydration Hero', description: 'Log 2000ml of water in a day', goal_type: 'daily_water_ml', threshold: 2000 },
  { title: 'Hydration Master', description: 'Log 3000ml of water in a day', goal_type: 'daily_water_ml', threshold: 3000 },
  { title: 'First Bite', description: 'Log your first meal', goal_type: 'meal_entries', threshold: 1 },
  { title: 'Consistent Logger', description: 'Log meals for 3 days in a row', goal_type: 'streak_days', threshold: 3 },
  { title: 'Week Warrior', description: 'Log meals for 7 days in a row', goal_type: 'streak_days', threshold: 7 },
  { title: 'Calorie Counter', description: 'Log 50 meals total', goal_type: 'total_meals', threshold: 50 },
];

const achievementModel = {
  async getByUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM achievements WHERE user_id=$1 ORDER BY earned_at DESC NULLS LAST',
      [userId]
    );
    return rows;
  },

  async checkAndAward(userId, { dailyWaterMl, streak, totalMeals, waterEntries, mealEntries }) {
    const existing = await this.getByUser(userId);
    const earnedTitles = existing.filter((a) => a.earned_at).map((a) => a.title);
    const newlyEarned = [];

    for (const def of ACHIEVEMENT_DEFINITIONS) {
      if (earnedTitles.includes(def.title)) continue;

      let progress = 0;
      let earned = false;

      switch (def.goal_type) {
        case 'daily_water_ml':
          progress = dailyWaterMl || 0;
          earned = progress >= def.threshold;
          break;
        case 'streak_days':
          progress = streak || 0;
          earned = progress >= def.threshold;
          break;
        case 'total_meals':
          progress = totalMeals || 0;
          earned = progress >= def.threshold;
          break;
        case 'water_entries':
          progress = waterEntries || 0;
          earned = progress >= def.threshold;
          break;
        case 'meal_entries':
          progress = mealEntries || 0;
          earned = progress >= def.threshold;
          break;
      }

      // Upsert achievement with current progress
      const existingRow = existing.find((a) => a.title === def.title);
      if (!existingRow) {
        await pool.query(
          `INSERT INTO achievements (user_id, title, description, goal_type, progress, earned_at)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [userId, def.title, def.description, def.goal_type, progress, earned ? new Date() : null]
        );
      } else {
        await pool.query(
          `UPDATE achievements SET progress=$1, earned_at=$2 WHERE id=$3`,
          [progress, earned ? new Date() : null, existingRow.id]
        );
      }

      if (earned) {
        newlyEarned.push(def.title);
      }
    }

    return newlyEarned;
  },
};

module.exports = achievementModel;
