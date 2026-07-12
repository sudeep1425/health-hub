import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';

const NAV_ITEMS = [
  { to: '/home',         icon: '🏠', label: 'Home'        },
  { to: '/dashboard',    icon: '📊', label: 'Dashboard'   },
  { to: '/bmi',          icon: '⚖️',  label: 'BMI'         },
  { to: '/zen',          icon: '🧘', label: 'Zen Mode'    },
  { to: '/achievements', icon: '🏆', label: 'Achievements' },
  { to: '/daily-log',   icon: '📝', label: 'Daily Log'   },
  { to: '/reports',      icon: '📈', label: 'Reports'     },
  { to: '/settings',     icon: '⚙️',  label: 'Settings'   },
];

export default function Sidebar({ onLogout, theme, onThemeToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🌿 Health Hub</h2>
        <span>wellness tracker</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="theme-toggle">
          <span className="theme-toggle-label">
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={onThemeToggle}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
