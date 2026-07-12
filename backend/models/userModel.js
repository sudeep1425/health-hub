const pool = require('../config/db');

const userModel = {
  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, is_active, created_at, last_login FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  async create({ name, email, password_hash }) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    return rows[0];
  },

  async updateLastLogin(id) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [id]);
  },

  async updateProfile(id, { name, email }) {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [name, email, id]
    );
    return rows[0];
  },

  async updatePassword(id, password_hash) {
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);
  },
};

module.exports = userModel;
