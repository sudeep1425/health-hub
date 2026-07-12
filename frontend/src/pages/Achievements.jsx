import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import AchievementBadge from '../components/AchievementBadge';

export default function Achievements({ user }) {
  const { achievements, loading } = useAchievements(user?.id);

  const earned = achievements.filter((a) => a.earned_at);
  const locked = achievements.filter((a) => !a.earned_at);

  if (loading) return <div className="spinner" />;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="gradient-text">Achievements</h1>
        <p className="subtitle-caps">Your wellness milestones</p>
      </div>

      {/* Summary */}
      <div className="glass-card" style={{
        padding: '24px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '20px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))',
        borderColor: 'rgba(245,158,11,0.3)',
      }}>
        <div style={{ fontSize: '3rem' }}>🏆</div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
            {earned.length} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {achievements.length}</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Achievements Earned</div>
          {earned.length === achievements.length && (
            <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '4px' }}>
              🎉 You've unlocked all badges!
            </div>
          )}
        </div>
      </div>

      {earned.length > 0 && (
        <>
          <h3 style={{ marginBottom: '16px', color: 'var(--warning)' }}>🏅 Earned Badges</h3>
          <div className="grid-3" style={{ marginBottom: '32px' }}>
            {earned.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>🔒 Locked Badges</h3>
          <div className="grid-3">
            {locked.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
          </div>
        </>
      )}

      {achievements.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p>Start logging meals and water to unlock your first achievement!</p>
        </div>
      )}
    </div>
  );
}
