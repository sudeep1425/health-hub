import { useState, useEffect, useCallback } from 'react';
import waterService from '../services/waterService';

export function useWaterIntake(userId) {
  const [logs, setLogs] = useState([]);
  const [dailyMl, setDailyMl] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await waterService.getAll(userId);
      setLogs(res.data.logs);
      // Compute today's total client-side
      const today = new Date().toISOString().split('T')[0];
      const todayTotal = res.data.logs
        .filter((l) => l.log_date?.startsWith(today))
        .reduce((acc, l) => acc + l.quantity_ml, 0);
      setDailyMl(todayTotal);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch water logs');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const addLog = useCallback(async (data) => {
    const res = await waterService.create(data);
    setLogs((prev) => [res.data.log, ...prev]);
    setDailyMl(res.data.dailyWaterMl);
    return res.data;
  }, []);

  const deleteLog = useCallback(async (id) => {
    await waterService.delete(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
    // Recompute daily total
    const today = new Date().toISOString().split('T')[0];
    setLogs((prev) => {
      const total = prev
        .filter((l) => l.log_date?.startsWith(today))
        .reduce((acc, l) => acc + l.quantity_ml, 0);
      setDailyMl(total);
      return prev;
    });
  }, []);

  return { logs, dailyMl, loading, error, addLog, deleteLog, refetch: fetchLogs };
}
