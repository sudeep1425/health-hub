import React, { useState } from 'react';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function FoodEntryForm({ onSubmit, loading, initialData = null, onCancel }) {
  const [form, setForm] = useState({
    food_name: initialData?.food_name || '',
    calories: initialData?.calories || '',
    meal_type: initialData?.meal_type || 'breakfast',
    log_date: initialData?.log_date || new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.food_name.trim()) return setError('Food name is required');
    if (!form.calories || form.calories < 0) return setError('Valid calories required');
    try {
      await onSubmit({ ...form, calories: parseInt(form.calories) });
      if (!initialData) setForm({ food_name: '', calories: '', meal_type: 'breakfast', log_date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save entry');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && <div className="error-msg">{error}</div>}
      <div className="form-group">
        <label>Food Name</label>
        <input className="form-input" name="food_name" value={form.food_name}
          onChange={handleChange} placeholder="e.g. Grilled Chicken Salad" required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label>Calories (kcal)</label>
          <input className="form-input" type="number" name="calories" value={form.calories}
            onChange={handleChange} placeholder="250" min="0" max="10000" required />
        </div>
        <div className="form-group">
          <label>Meal Type</label>
          <select className="form-input" name="meal_type" value={form.meal_type} onChange={handleChange}>
            {MEAL_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Date</label>
        <input className="form-input" type="date" name="log_date" value={form.log_date} onChange={handleChange} />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? '⏳ Saving...' : initialData ? '✏️ Update Entry' : '➕ Add Entry'}
        </button>
        {onCancel && (
          <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
