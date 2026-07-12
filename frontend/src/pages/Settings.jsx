import React, { useState } from 'react';
import authService from '../services/authService';
import GlassCard from '../components/GlassCard';

export default function Settings({ user, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(profileForm);
      onUserUpdate?.(data.user);
      // Update stored user
      const stored = localStorage.getItem('user') ? localStorage : sessionStorage;
      stored.setItem('user', JSON.stringify(data.user));
      showMsg('success', 'Profile updated successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showMsg('error', 'New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return showMsg('error', 'New password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMsg('success', 'Password changed successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const TABS = ['profile', 'password'];

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="gradient-text">Settings</h1>
        <p className="subtitle-caps">Manage your account</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((t) => (
          <button key={t} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(t)}>
            {t === 'profile' ? '👤 Profile' : '🔑 Password'}
          </button>
        ))}
      </div>

      {msg.text && (
        <div className={msg.type === 'success' ? 'success-msg' : 'error-msg'} style={{ marginBottom: '16px' }}>
          {msg.text}
        </div>
      )}

      {activeTab === 'profile' && (
        <GlassCard style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>👤 Update Profile</h3>
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" type="text" value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </GlassCard>
      )}

      {activeTab === 'password' && (
        <GlassCard style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>🔑 Change Password</h3>
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div className="form-group" key={field}>
                <label>{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input className="form-input" type="password" value={passwordForm[field]}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••" required />
              </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? '⏳ Changing...' : '🔐 Change Password'}
            </button>
          </form>
        </GlassCard>
      )}

      {/* Account info */}
      <GlassCard style={{ padding: '20px', marginTop: '20px' }}>
        <p className="subtitle-caps" style={{ marginBottom: '10px' }}>Account Info</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
        </p>
      </GlassCard>
    </div>
  );
}
