const pool = require('../config/db');
const bcrypt = require('bcrypt');

const adminModel = {
  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
    return rows[0];
  },

  async getAllUsers() {
    const { rows } = await pool.query(
      `SELECT
         u.id, u.name, u.email, u.role, u.is_active, u.created_at, u.last_login,
         COUNT(DISTINCT d.id) AS total_meals,
         COALESCE(EXTRACT(DAY FROM NOW() - u.last_login), 999) AS days_inactive
       FROM users u
       LEFT JOIN diet_logs d ON d.user_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    return rows;
  },

  async createUser({ name, email, password }) {
    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    return rows[0];
  },

  async deleteUser(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);
    return rows[0];
  },

  async toggleUserStatus(id) {
    const { rows } = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id=$1 RETURNING id, is_active',
      [id]
    );
    return rows[0];
  },

  async getStats() {
    const { rows: userRows } = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const { rows: mealRows } = await pool.query('SELECT COUNT(*) AS total_meals FROM diet_logs');
    const { rows: waterRows } = await pool.query(
      'SELECT COALESCE(SUM(quantity_ml)/1000.0, 0) AS total_liters FROM water_intake'
    );
    const { rows: activeRows } = await pool.query(
      `SELECT COUNT(DISTINCT user_id) AS active_today FROM diet_logs WHERE log_date = CURRENT_DATE`
    );
    return {
      total_users: parseInt(userRows[0].total_users, 10),
      total_meals: parseInt(mealRows[0].total_meals, 10),
      total_liters: parseFloat(waterRows[0].total_liters).toFixed(1),
      active_today: parseInt(activeRows[0].active_today, 10),
    };
  },
};

module.exports = adminModel;
