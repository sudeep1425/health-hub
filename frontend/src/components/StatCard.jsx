import React from 'react';

export default function StatCard({ icon, label, value, unit = '', gradient, subtitle }) {
  return (
    <div className="glass-card stat-card" style={{ padding: '24px' }}>
      <div className="stat-icon" style={{ background: gradient }}>
        {icon}
      </div>
      <div className="stat-value">
        <span className="stat-number">{value}</span>
        {unit && <span className="stat-unit"> {unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}

      <style>{`
        .stat-card { transition: all 0.25s ease; }
        .stat-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 16px;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .stat-unit {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 6px;
        }
        .stat-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
