import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BMI from './pages/BMI';
import ZenMode from './pages/ZenMode';
import Achievements from './pages/Achievements';
import DailyLog from './pages/DailyLog';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';
import './styles/sidebar.css';

function AppLayout({ children, user, onLogout, onUserUpdate, theme, toggleTheme }) {
  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} theme={theme} onThemeToggle={toggleTheme} />
      <main className="main-content">
        {React.cloneElement(children, { user, onUserUpdate })}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const handleLogout = () => {
    logout();
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const withLayout = (Page) => (
    <ProtectedRoute>
      <AppLayout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} theme={theme} toggleTheme={toggleTheme}>
        <Page />
      </AppLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Protected user pages */}
      <Route path="/home" element={withLayout(Home)} />
      <Route path="/dashboard" element={withLayout(Dashboard)} />
      <Route path="/bmi" element={withLayout(BMI)} />
      <Route path="/zen" element={withLayout(ZenMode)} />
      <Route path="/achievements" element={withLayout(Achievements)} />
      <Route path="/daily-log" element={
        <ProtectedRoute>
          <AppLayout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} theme={theme} toggleTheme={toggleTheme}>
            <DailyLog user={currentUser} />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={withLayout(Reports)} />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} theme={theme} toggleTheme={toggleTheme}>
            <Settings user={currentUser} onUserUpdate={handleUserUpdate} />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={withLayout(Alerts)} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
