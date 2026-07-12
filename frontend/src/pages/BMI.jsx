import React, { useState } from 'react';

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', emoji: '🔵' };
  if (bmi < 25)   return { label: 'Normal',      color: '#10b981', emoji: '🟢' };
  if (bmi < 30)   return { label: 'Overweight',  color: '#f59e0b', emoji: '🟡' };
  return           { label: 'Obese',             color: '#ef4444', emoji: '🔴' };
}

export default function BMI() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric'); // metric | imperial
  const [result, setResult] = useState(null);

  const calculate = () => {
    let h = parseFloat(height);
    let w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    let bmi;
    if (unit === 'metric') {
      bmi = w / ((h / 100) ** 2);
    } else {
      // imperial: height in inches, weight in lbs
      bmi = (703 * w) / (h ** 2);
    }
    setResult(bmi);
  };

  const category = result ? getBMICategory(result) : null;

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="gradient-text">BMI Calculator</h1>
        <p className="subtitle-caps">Body Mass Index</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['metric', 'imperial'].map((u) => (
            <button key={u} className={`btn ${unit === u ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => { setUnit(u); setResult(null); setHeight(''); setWeight(''); }}>
              {u === 'metric' ? '📏 Metric (cm/kg)' : '🦅 Imperial (in/lbs)'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group">
            <label>Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input className="form-input" type="number" value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? '170' : '67'} />
          </div>
          <div className="form-group">
            <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input className="form-input" type="number" value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '154'} />
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={calculate}>
          ⚖️ Calculate BMI
        </button>
      </div>

      {result && category && (
        <div className="glass-card" style={{
          padding: '32px', textAlign: 'center',
          borderColor: category.color + '55',
          background: `linear-gradient(135deg, ${category.color}11, ${category.color}06)`,
          animation: 'fadeInUp 0.4s ease',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{category.emoji}</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: category.color, marginBottom: '8px' }}>
            {result.toFixed(1)}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: category.color, marginBottom: '16px' }}>
            {category.label}
          </div>

          {/* BMI scale */}
          <div style={{ maxWidth: '360px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem',
              color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
            <div style={{ height: '10px', borderRadius: '999px', overflow: 'hidden',
              background: 'linear-gradient(90deg, #3b82f6, #10b981 30%, #f59e0b 60%, #ef4444)' }}>
              <div style={{
                width: '12px', height: '10px',
                background: '#fff',
                borderRadius: '999px',
                marginLeft: `${Math.min(Math.max((result - 10) / 30 * 100, 0), 97)}%`,
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                transition: 'margin-left 0.5s ease',
              }} />
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            BMI is a screening tool. Consult a healthcare provider for professional advice.
          </p>
        </div>
      )}

      {/* Reference table */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>BMI Reference</h3>
        <table>
          <thead><tr><th>Category</th><th>BMI Range</th></tr></thead>
          <tbody>
            {[
              ['🔵 Underweight', '< 18.5'],
              ['🟢 Normal',      '18.5 – 24.9'],
              ['🟡 Overweight',  '25.0 – 29.9'],
              ['🔴 Obese',       '≥ 30.0'],
            ].map(([cat, range]) => (
              <tr key={cat}><td>{cat}</td><td>{range}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }`}</style>
    </div>
  );
}
