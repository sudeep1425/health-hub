import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login({ email: form.email, password: form.password, remember: form.remember });
      navigate('/home');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card auth-card">
          <div className="auth-header">
            <div className="auth-logo">🌿</div>
            <h1 className="gradient-text">Login</h1>
            <p className="subtitle-caps">Welcome to Health Hub</p>
          </div>

          {(formError || error) && (
            <div className="error-msg" style={{ marginBottom: '16px' }}>{formError || error}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Your password" required />
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              Remember Me
            </label>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🔑 Login'}
            </button>
          </form>

          <div className="auth-footer">
            New user?{' '}
            <Link to="/register">Create account</Link>
          </div>
          <div className="auth-switch">
            <Link to="/admin/login">↗ Switch to Admin Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
