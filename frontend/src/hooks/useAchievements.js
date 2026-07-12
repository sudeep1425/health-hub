import { useState, useEffect, useCallback } from 'react';
import achievementService from '../services/achievementService';

export function useAchievements(userId) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await achievementService.getAll(userId);
      setAchievements(res.data.achievements);
    } catch (err) {
      console.error('Failed to fetch achievements', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchAchievements(); }, [fetchAchievements]);

  return { achievements, loading, refetch: fetchAchievements };
}
