import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import dietService from '../services/dietService';

const CALORIE_GOAL = 2000;
const WATER_GOAL_ML = 2000;

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState({ calories: 0, meals_count: 0, water_ml: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const { data } = await dietService.getSummary();
      setSummary(data);
    } catch {/* silently handled */}
    setLoading(false);
  };

  useEffect(() => { fetchSummary(); }, []);

  const caloriePct = Math.min((summary.calories / CALORIE_GOAL) * 100, 100);
  const waterPct = Math.min((summary.water_ml / WATER_GOAL_ML) * 100, 100);

  const STATS = [
    {
      icon: '🔥',
      label: 'Calories Today',
      value: summary.calories,
      unit: 'kcal',
      gradient: 'var(--gradient-stat-1)',
      subtitle: `Goal: ${CALORIE_GOAL} kcal`,
    },
    {
      icon: '💧',
      label: 'Water Intake',
      value: (summary.water_ml / 1000).toFixed(1),
      unit: 'L',
      gradient: 'var(--gradient-stat-2)',
      subtitle: `Goal: ${WATER_GOAL_ML / 1000}L`,
    },
    {
      icon: '🍽️',
      label: 'Meals Logged',
      value: summary.meals_count,
      unit: '',
      gradient: 'var(--gradient-stat-3)',
      subtitle: 'Today',
    },
    {
      icon: '⚡',
      label: 'Day Streak',
      value: summary.streak,
      unit: 'days',
      gradient: 'var(--gradient-stat-4)',
      subtitle: 'Consecutive logging days',
    },
  ];

  if (loading) return <div className="spinner" />;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="page-header">
        <h1 className="gradient-text">Dashboard</h1>
        <p className="subtitle-caps">Real-time health overview</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Progress bars */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Daily Goal Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>🔥 Calorie Goal</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {summary.calories} / {CALORIE_GOAL} kcal
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${caloriePct}%`,
                background: caloriePct > 90 ? 'var(--gradient-stat-1)' : 'var(--gradient-green)',
                borderRadius: '999px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>💧 Hydration Goal</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {summary.water_ml} / {WATER_GOAL_ML} ml
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${waterPct}%`,
                background: 'var(--gradient-stat-2)',
                borderRadius: '999px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Motivational footer */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.07))',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{ fontSize: '2rem' }}>
          {summary.streak > 6 ? '🏆' : summary.streak > 2 ? '🔥' : '🌱'}
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {summary.streak > 6
              ? 'Incredible streak! You\'re on fire!'
              : summary.streak > 2
              ? `${summary.streak}-day streak! Keep going!`
              : 'Start logging today to build your streak!'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track every meal and glass of water to stay consistent.
          </div>
        </div>
      </div>
    </div>
  );
}
