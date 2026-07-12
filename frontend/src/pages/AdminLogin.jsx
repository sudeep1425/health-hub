import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import '../styles/auth.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await adminService.login({ email: form.email, password: form.password });
      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem('adminToken', data.token);
      storage.setItem('adminUser', JSON.stringify(data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card auth-card" style={{ borderColor: 'rgba(59,130,246,0.4)' }}>
          <div className="auth-header">
            <div className="auth-logo">🛡️</div>
            <h1 className="gradient-text">Admin Login</h1>
            <p className="subtitle-caps">Security Clearance Required</p>
          </div>

          {error && (
            <div className="error-msg" style={{ marginBottom: '16px' }}>{error}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <input className="form-input" type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="admin@healthhub.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Admin password" required />
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              Remember Me
            </label>

            <button className="btn btn-admin btn-full" type="submit" disabled={loading}>
              {loading ? '⏳ Verifying...' : '🛡️ Access Admin Panel'}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">← Back to User Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
