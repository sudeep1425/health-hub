import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import GlassCard from '../components/GlassCard';

function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const NAV = [
    { icon: '🏠', label: 'Home', action: () => navigate('/admin/dashboard') },
    { icon: '👥', label: 'Admin Panel', action: () => navigate('/admin/dashboard') },
    { icon: '⚙️', label: 'Settings', action: () => {} },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🛡️ Admin Hub</h2>
        <span>command center</span>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <button key={item.label} className="nav-item" onClick={item.action}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="theme-toggle">
          <span className="theme-toggle-label"><span>{theme === 'dark' ? '🌙' : '☀️'}</span> {theme === 'dark' ? 'Dark' : 'Light'}</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
            <span className="toggle-slider" />
          </label>
        </div>
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_users: 0, total_meals: 0, total_liters: 0, active_today: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats(),
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data);
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    await adminService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setStats((s) => ({ ...s, total_users: s.total_users - 1 }));
  };

  const handleToggle = async (id) => {
    const res = await adminService.toggleUser(id);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: res.data.is_active } : u));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      const res = await adminService.createUser(newUser);
      setUsers((prev) => [{ ...res.data.user, total_meals: 0, is_active: true }, ...prev]);
      setStats((s) => ({ ...s, total_users: s.total_users + 1 }));
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '' });
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchTab = filterTab === 'All' ||
      (filterTab === 'Active' && u.is_active) ||
      (filterTab === 'Inactive' && !u.is_active);
    return matchSearch && matchTab;
  });

  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;

  const STATS_DATA = [
    { icon: '👥', label: 'Total Users', value: stats.total_users, gradient: 'var(--gradient-stat-4)' },
    { icon: '🍽️', label: 'Total Meals Logged', value: stats.total_meals, gradient: 'var(--gradient-stat-1)' },
    { icon: '💧', label: 'Water Tracked', value: `${stats.total_liters}L`, gradient: 'var(--gradient-stat-2)' },
    { icon: '⚡', label: 'Active Today', value: stats.active_today, gradient: 'var(--gradient-stat-3)', live: true },
  ];

  return (
    <div className="app-layout">
      <AdminSidebar onLogout={handleLogout} />
      <main className="main-content" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <div>
            <h1 className="gradient-text">Admin Command Center</h1>
            <p className="subtitle-caps">Platform Overview & User Management</p>
          </div>
          <button className="btn btn-admin" onClick={() => setShowAddModal(true)}>
            ➕ Add User
          </button>
        </div>

        {/* Stat cards */}
        {loading ? <div className="spinner" /> : (
          <>
            <div className="grid-4" style={{ marginBottom: '28px' }}>
              {STATS_DATA.map((s) => (
                <GlassCard key={s.label} style={{ padding: '24px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: s.gradient, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.2rem', marginBottom: '14px',
                  }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                    {s.live && <span className="pulse-dot" />}{s.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '4px' }}>
                    {s.label}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Filter tabs + search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: `All (${users.length})`, key: 'All' },
                  { label: `Active (${activeCount})`, key: 'Active' },
                  { label: `Inactive (${inactiveCount})`, key: 'Inactive' },
                ].map((t) => (
                  <button key={t.key} className={`btn btn-sm ${filterTab === t.key ? 'btn-admin' : 'btn-ghost'}`}
                    onClick={() => setFilterTab(t.key)}>{t.label}</button>
                ))}
              </div>
              <input className="form-input" style={{ maxWidth: '280px' }}
                placeholder="🔍 Search by name or email..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Users table */}
            <GlassCard style={{ padding: '24px' }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>User Info</th>
                      <th>Role</th>
                      <th>Last Activity</th>
                      <th>Days Inactive</th>
                      <th>Total Meals</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No users found.
                      </td></tr>
                    ) : filteredUsers.map((user) => {
                      const daysInactive = user.days_inactive ? Math.floor(parseFloat(user.days_inactive)) : '—';
                      return (
                        <tr key={user.id}>
                          <td>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{user.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                          </td>
                          <td><span className="badge badge-purple">{user.role || 'user'}</span></td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: daysInactive > 7 ? 'var(--warning)' : 'var(--text-muted)' }}>
                            {daysInactive === 999 || daysInactive === '—' ? 'Never' : `${daysInactive}d`}
                          </td>
                          <td><span className="badge badge-info">{user.total_meals || 0}</span></td>
                          <td>
                            <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                              {user.is_active ? '● Active' : '○ Inactive'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(user.id)}
                                title={user.is_active ? 'Deactivate' : 'Activate'}>
                                {user.is_active ? '🔒' : '🔓'}
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
            padding: '20px',
          }} onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '36px' }}>
              <h2 style={{ marginBottom: '20px' }}>➕ Add New User</h2>
              {addError && <div className="error-msg" style={{ marginBottom: '14px' }}>{addError}</div>}
              <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name', name: 'name', type: 'text', ph: 'Jane Doe' },
                  { label: 'Email', name: 'email', type: 'email', ph: 'jane@example.com' },
                  { label: 'Password', name: 'password', type: 'password', ph: 'Min 6 characters' },
                ].map((f) => (
                  <div className="form-group" key={f.name}>
                    <label>{f.label}</label>
                    <input className="form-input" type={f.type} value={newUser[f.name]} placeholder={f.ph}
                      onChange={(e) => setNewUser((p) => ({ ...p, [f.name]: e.target.value }))} required />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button className="btn btn-admin btn-full" type="submit" disabled={addLoading}>
                    {addLoading ? '⏳ Creating...' : '✅ Create User'}
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
