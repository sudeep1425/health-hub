import React from 'react';

const BADGE_ICONS = {
  daily_water_ml: '💧',
  streak_days: '🔥',
  total_meals: '🍽️',
  water_entries: '🌊',
  meal_entries: '⭐',
};

export default function AchievementBadge({ achievement }) {
  const earned = !!achievement.earned_at;
  const icon = BADGE_ICONS[achievement.goal_type] || '🏆';

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        textAlign: 'center',
        opacity: earned ? 1 : 0.5,
        filter: earned ? 'none' : 'grayscale(60%)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {earned && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'var(--gradient-green)',
          borderRadius: '999px', padding: '2px 8px',
          fontSize: '0.65rem', fontWeight: 700, color: '#fff',
        }}>✓ EARNED</div>
      )}
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{achievement.title}</h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
        {achievement.description}
      </p>

      {/* Progress bar */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '999px',
        height: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: earned ? 'var(--gradient-green)' : 'var(--gradient-blue-purple)',
          width: earned ? '100%' : `${Math.min((achievement.progress / 1) * 100, 100)}%`,
          borderRadius: '999px',
          transition: 'width 0.6s ease',
        }} />
      </div>

      {earned && achievement.earned_at && (
        <p style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '8px' }}>
          Earned {new Date(achievement.earned_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
