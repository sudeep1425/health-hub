import React from 'react';
import GlassCard from '../components/GlassCard';

const ALERT_DEFINITIONS = [
  {
    id: 'hydration',
    icon: '💧',
    title: 'Hydration Goal Met',
    desc: 'You reach your daily water goal of 2L',
    color: '#3b82f6',
  },
  {
    id: 'calories',
    icon: '🔥',
    title: 'Calorie Goal Approaching',
    desc: "You're within 200 kcal of your daily limit",
    color: '#f59e0b',
  },
  {
    id: 'streak',
    icon: '⚡',
    title: 'Streak Milestone',
    desc: 'You reach a 3, 7, or 30-day streak',
    color: '#8b5cf6',
  },
  {
    id: 'achievement',
    icon: '🏆',
    title: 'Achievement Unlocked',
    desc: 'Any badge is earned',
    color: '#ec4899',
  },
];

export default function Alerts() {
  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h1 className="gradient-text">Alerts</h1>
        <p className="subtitle-caps">Goal & validation notifications</p>
      </div>

      <div className="glass-card" style={{
        padding: '20px 24px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.07))',
        borderColor: 'rgba(16,185,129,0.3)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ fontSize: '1.4rem' }}>ℹ️</span>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Alerts appear as toast notifications instantly when you log entries in Daily Log. The types below are active by default.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ALERT_DEFINITIONS.map((alert) => (
          <GlassCard key={alert.id} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              background: alert.color + '22',
              border: `1px solid ${alert.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
            }}>
              {alert.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{alert.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Triggered when: {alert.desc}</div>
            </div>
            <span className="badge badge-success">Active</span>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ padding: '20px 24px', marginTop: '24px' }}>
        <p className="subtitle-caps" style={{ marginBottom: '8px' }}>How alerts work</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
          Every time you add a food or water entry, the backend checks goal thresholds and returns any newly earned achievements.
          The Daily Log page surfaces these as gradient toast notifications in the bottom-right corner.
        </p>
      </GlassCard>
    </div>
  );
}
