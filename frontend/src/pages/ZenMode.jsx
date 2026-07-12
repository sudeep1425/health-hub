import React, { useState, useEffect, useRef } from 'react';

const MODES = [
  { id: 'breathe', label: '🌬️ Box Breathing', desc: '4-4-4-4 breathing technique' },
  { id: 'water',   label: '💧 Hydration Break', desc: 'Drink water reminder' },
  { id: 'stretch', label: '🧘 Micro Stretch',   desc: '2-minute desk stretch' },
];

const BOX_PHASES = [
  { label: 'Inhale',      duration: 4, color: '#3b82f6' },
  { label: 'Hold',        duration: 4, color: '#7c3aed' },
  { label: 'Exhale',      duration: 4, color: '#10b981' },
  { label: 'Hold Empty',  duration: 4, color: '#ec4899' },
];

const STRETCHES = [
  '🙆 Roll your shoulders back 5 times',
  '🤸 Tilt your head gently left, hold 10s, then right',
  '🙌 Clasp hands above head, stretch upward',
  '🦵 Stand and march in place for 30 seconds',
  '👁️ Look away from the screen and focus on something 20ft away for 20 seconds',
];

export default function ZenMode() {
  const [mode, setMode] = useState('breathe');
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(BOX_PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode !== 'breathe' || !running) return;

    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        // Advance phase
        setPhase((p) => {
          const next = (p + 1) % BOX_PHASES.length;
          if (next === 0) setCycles((x) => x + 1);
          setCount(BOX_PHASES[next].duration);
          return next;
        });
        return BOX_PHASES[0].duration; // overridden above
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, mode]);

  const toggle = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setPhase(0);
      setCount(BOX_PHASES[0].duration);
    } else {
      setRunning(true);
    }
  };

  const currentPhase = BOX_PHASES[phase];
  const pct = ((BOX_PHASES[phase].duration - count) / BOX_PHASES[phase].duration) * 100;

  return (
    <div style={{ maxWidth: '680px' }}>
      <div className="page-header">
        <h1 className="gradient-text">Zen Mode</h1>
        <p className="subtitle-caps">Take a wellness break</p>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {MODES.map((m) => (
          <button key={m.id}
            className={`btn ${mode === m.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setMode(m.id); setRunning(false); setPhase(0); setCount(4); }}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'breathe' && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Box breathing reduces stress and improves focus. Follow the circle.
          </p>

          {/* Animated breathing circle */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 32px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle cx="100" cy="100" r="85" fill="none"
                stroke={currentPhase.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - pct / 100)}`}
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: currentPhase.color }}>{count}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {currentPhase.label}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-purple">Cycles completed: {cycles}</span>
          </div>

          <button className="btn btn-primary" onClick={toggle} style={{ minWidth: '160px' }}>
            {running ? '⏹ Stop' : '▶ Start Breathing'}
          </button>
        </div>
      )}

      {mode === 'water' && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💧</div>
          <h2 style={{ marginBottom: '8px' }}>Hydration Break</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px' }}>
            Take a moment to drink a glass of water right now. You've logged {waterCount} glass{waterCount !== 1 ? 'es' : ''} in this session.
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '8px',
            marginBottom: '28px', flexWrap: 'wrap',
          }}>
            {Array.from({ length: Math.min(waterCount, 8) }).map((_, i) => (
              <span key={i} style={{ fontSize: '1.8rem' }}>💧</span>
            ))}
            {waterCount === 0 && <span style={{ color: 'var(--text-muted)' }}>No glasses yet</span>}
          </div>
          <button className="btn btn-primary" onClick={() => setWaterCount((c) => c + 1)}>
            ✅ I drank a glass of water!
          </button>
        </div>
      )}

      {mode === 'stretch' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>🧘 Micro Stretch Routine</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Do each stretch in order. Take it easy — no pushing through discomfort.
          </p>
          {STRETCHES.map((stretch, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 0',
              borderBottom: i < STRETCHES.length - 1 ? '1px solid var(--glass-border)' : 'none',
            }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'var(--gradient-blue-purple)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700,
                color: '#fff', flexShrink: 0,
              }}>{i + 1}</div>
              <span style={{ lineHeight: '1.5' }}>{stretch}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
