import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
}
