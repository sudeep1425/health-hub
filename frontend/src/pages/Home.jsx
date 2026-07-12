import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  const QUICK_ACTIONS = [
    { icon: '📝', label: 'Log a Meal', desc: 'Track your food intake', to: '/daily-log' },
    { icon: '💧', label: 'Log Water', desc: 'Stay hydrated today', to: '/daily-log' },
    { icon: '📊', label: 'View Dashboard', desc: 'See your stats', to: '/dashboard' },
    { icon: '🏆', label: 'Achievements', desc: 'Check your badges', to: '/achievements' },
  ];

  const TIPS = [
    '💡 Drink at least 8 glasses of water a day!',
    '🥗 Eat a rainbow — varied colors mean varied nutrients.',
    '🌙 Quality sleep helps regulate hunger hormones.',
    '🚶 Even a 10-minute walk after meals improves digestion.',
    '🥗 Meal prep on Sundays to make healthy choices easier.',
  ];

  const tip = TIPS[new Date().getDay() % TIPS.length];

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Hero greeting */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌿</div>
        <h1 className="gradient-text" style={{ marginBottom: '8px' }}>
          Welcome, {firstName}!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 20px' }}>
          Your journey to a healthier lifestyle starts here.
        </p>
        <p className="subtitle-caps">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Actions */}
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Quick Actions</h3>
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {QUICK_ACTIONS.map((action) => (
          <div
            key={action.label}
            className="glass-card"
            onClick={() => navigate(action.to)}
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{
              width: '52px', height: '52px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}>
              {action.icon}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{action.label}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{action.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Wellness Tip */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))',
        borderColor: 'rgba(167,139,250,0.3)',
      }}>
        <p className="subtitle-caps" style={{ marginBottom: '8px' }}>💡 Wellness Tip of the Day</p>
        <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tip}</p>
      </div>
    </div>
  );
}
