const pool = require('../config/db');

const dietModel = {
  async getByUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM diet_logs WHERE user_id = $1 ORDER BY log_date DESC, created_at DESC',
      [userId]
    );
    return rows;
  },

  async getByUserAndDate(userId, date) {
    const { rows } = await pool.query(
      'SELECT * FROM diet_logs WHERE user_id = $1 AND log_date = $2 ORDER BY created_at ASC',
      [userId, date]
    );
    return rows;
  },

  async create({ user_id, food_name, calories, meal_type, log_date }) {
    const { rows } = await pool.query(
      `INSERT INTO diet_logs (user_id, food_name, calories, meal_type, log_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, food_name, calories, meal_type, log_date || new Date().toISOString().split('T')[0]]
    );
    return rows[0];
  },

  async update(id, userId, { food_name, calories, meal_type, log_date }) {
    const { rows } = await pool.query(
      `UPDATE diet_logs SET food_name=$1, calories=$2, meal_type=$3, log_date=$4
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [food_name, calories, meal_type, log_date, id, userId]
    );
    return rows[0];
  },

  async delete(id, userId) {
    const { rows } = await pool.query(
      'DELETE FROM diet_logs WHERE id=$1 AND user_id=$2 RETURNING id',
      [id, userId]
    );
    return rows[0];
  },

  async getDailyTotals(userId, date) {
    const { rows } = await pool.query(
      `SELECT
         COALESCE(SUM(calories), 0) AS total_calories,
         COUNT(*) AS meals_count
       FROM diet_logs
       WHERE user_id=$1 AND log_date=$2`,
      [userId, date]
    );
    return rows[0];
  },

  async getStreakDays(userId) {
    // Count consecutive days with at least one log
    const { rows } = await pool.query(
      `WITH dated AS (
         SELECT DISTINCT log_date FROM diet_logs WHERE user_id=$1 ORDER BY log_date DESC
       ),
       ranked AS (
         SELECT log_date, ROW_NUMBER() OVER (ORDER BY log_date DESC) AS rn FROM dated
       )
       SELECT COUNT(*) AS streak
       FROM ranked
       WHERE log_date = (CURRENT_DATE - INTERVAL '1 day' * (rn - 1))::date`,
      [userId]
    );
    return parseInt(rows[0].streak, 10);
  },

  async getTotalMealsCount(userId) {
    const { rows } = await pool.query(
      'SELECT COUNT(*) AS total FROM diet_logs WHERE user_id=$1',
      [userId]
    );
    return parseInt(rows[0].total, 10);
  },

  async getHistorical(userId, days = 30) {
    const { rows } = await pool.query(
      `SELECT log_date, SUM(calories) AS total_calories, COUNT(*) AS meals_count
       FROM diet_logs
       WHERE user_id=$1 AND log_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
       GROUP BY log_date ORDER BY log_date ASC`,
      [userId]
    );
    return rows;
  },
};

module.exports = dietModel;
