const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

const adminController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const admin = await adminModel.findByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }
      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: 'admin' },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: '8h' }
      );
      return res.json({ token, admin: { id: admin.id, email: admin.email } });
    } catch (err) {
      next(err);
    }
  },

  async getUsers(req, res, next) {
    try {
      const users = await adminModel.getAllUsers();
      return res.json({ users });
    } catch (err) {
      next(err);
    }
  },

  async createUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await adminModel.createUser({ name, email, password });
      return res.status(201).json({ user });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await adminModel.deleteUser(id);
      if (!deleted) return res.status(404).json({ error: 'User not found' });
      return res.json({ message: 'User deleted', id: deleted.id });
    } catch (err) {
      next(err);
    }
  },

  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminModel.toggleUserStatus(id);
      if (!result) return res.status(404).json({ error: 'User not found' });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await adminModel.getStats();
      return res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
