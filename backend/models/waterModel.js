const pool = require('../config/db');

const waterModel = {
  async getByUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM water_intake WHERE user_id=$1 ORDER BY log_date DESC, created_at DESC',
      [userId]
    );
    return rows;
  },

  async getByUserAndDate(userId, date) {
    const { rows } = await pool.query(
      'SELECT * FROM water_intake WHERE user_id=$1 AND log_date=$2 ORDER BY created_at ASC',
      [userId, date]
    );
    return rows;
  },

  async create({ user_id, quantity_ml, log_date }) {
    const { rows } = await pool.query(
      'INSERT INTO water_intake (user_id, quantity_ml, log_date) VALUES ($1, $2, $3) RETURNING *',
      [user_id, quantity_ml, log_date || new Date().toISOString().split('T')[0]]
    );
    return rows[0];
  },

  async delete(id, userId) {
    const { rows } = await pool.query(
      'DELETE FROM water_intake WHERE id=$1 AND user_id=$2 RETURNING id',
      [id, userId]
    );
    return rows[0];
  },

  async getDailyTotal(userId, date) {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(quantity_ml), 0) AS total_ml FROM water_intake
       WHERE user_id=$1 AND log_date=$2`,
      [userId, date]
    );
    return rows[0];
  },

  async getHistorical(userId, days = 30) {
    const { rows } = await pool.query(
      `SELECT log_date, SUM(quantity_ml) AS total_ml
       FROM water_intake
       WHERE user_id=$1 AND log_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
       GROUP BY log_date ORDER BY log_date ASC`,
      [userId]
    );
    return rows;
  },
};

module.exports = waterModel;
