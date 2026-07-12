const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const existing = await userModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const password_hash = await bcrypt.hash(password, 10);
      const user = await userModel.create({ name, email, password_hash });
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(201).json({ token, user });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      await userModel.updateLastLogin(user.id);
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const updated = await userModel.updateProfile(req.user.id, { name, email });
      return res.json({ user: updated });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await userModel.findByEmail(req.user.email);
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
      const password_hash = await bcrypt.hash(newPassword, 10);
      await userModel.updatePassword(req.user.id, password_hash);
      return res.json({ message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
