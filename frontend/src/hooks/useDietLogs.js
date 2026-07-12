import { useState, useEffect, useCallback } from 'react';
import dietService from '../services/dietService';

export function useDietLogs(userId) {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ calories: 0, meals_count: 0, water_ml: 0, streak: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [logsRes, summaryRes] = await Promise.all([
        dietService.getAll(userId),
        dietService.getSummary(),
      ]);
      setLogs(logsRes.data.logs);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch diet logs');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const addLog = useCallback(async (data) => {
    const res = await dietService.create(data);
    // Real-time: prepend log and update summary without refetch
    setLogs((prev) => [res.data.log, ...prev]);
    if (res.data.summary) setSummary(res.data.summary);
    return res.data;
  }, []);

  const updateLog = useCallback(async (id, data) => {
    const res = await dietService.update(id, data);
    setLogs((prev) => prev.map((l) => (l.id === id ? res.data.log : l)));
    return res.data;
  }, []);

  const deleteLog = useCallback(async (id) => {
    await dietService.delete(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { logs, summary, loading, error, addLog, updateLog, deleteLog, refetch: fetchLogs };
}
