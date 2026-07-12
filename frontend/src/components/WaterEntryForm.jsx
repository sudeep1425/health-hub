import React, { useState } from 'react';

export default function WaterEntryForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    quantity_ml: '',
    log_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const PRESETS = [250, 330, 500, 750];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const qty = parseInt(form.quantity_ml);
    if (!qty || qty < 1 || qty > 5000) return setError('Enter a valid amount (1–5000 ml)');
    try {
      await onSubmit({ ...form, quantity_ml: qty });
      setForm({ quantity_ml: '', log_date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save entry');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && <div className="error-msg">{error}</div>}

      <div className="form-group">
        <label>Quick Add</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((ml) => (
            <button key={ml} type="button" className="btn btn-ghost btn-sm"
              onClick={() => setForm((p) => ({ ...p, quantity_ml: ml }))}>
              💧 {ml}ml
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label>Amount (ml)</label>
          <input className="form-input" type="number" value={form.quantity_ml}
            onChange={(e) => setForm((p) => ({ ...p, quantity_ml: e.target.value }))}
            placeholder="250" min="1" max="5000" required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input className="form-input" type="date" value={form.log_date}
            onChange={(e) => setForm((p) => ({ ...p, log_date: e.target.value }))} />
        </div>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? '⏳ Logging...' : '💧 Log Water'}
      </button>
    </form>
  );
}
