import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const STORAGE_KEY = 'token';
const USER_KEY = 'user';

function getStorage(remember) {
  return remember ? localStorage : sessionStorage;
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password, remember = false }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.login({ email, password });
      const storage = getStorage(remember);
      storage.setItem(STORAGE_KEY, data.token);
      storage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, remember = false }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.register({ name, email, password });
      const storage = getStorage(remember);
      storage.setItem(STORAGE_KEY, data.token);
      storage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return { user, loading, error, login, register, logout, isAuthenticated };
}
