import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import reportsService from '../services/reportsService';
import GlassCard from '../components/GlassCard';

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,10,30,0.95)', border: '1px solid var(--glass-border)',
      borderRadius: '10px', padding: '12px 16px', fontSize: '0.85rem',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Reports({ user }) {
  const [data, setData] = useState({ dietHistory: [], waterHistory: [] });
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    reportsService.getReport(user.id, days)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, days]);

  // Merge diet & water by date
  const merged = (() => {
    const map = {};
    data.dietHistory.forEach((d) => {
      const date = d.log_date?.toString().slice(0, 10);
      map[date] = { date, calories: parseInt(d.total_calories || 0), meals: parseInt(d.meals_count || 0) };
    });
    data.waterHistory.forEach((w) => {
      const date = w.log_date?.toString().slice(0, 10);
      map[date] = { ...(map[date] || { date, calories: 0, meals: 0 }), water_L: parseFloat((w.total_ml / 1000).toFixed(2)) };
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  const totalCal = merged.reduce((acc, d) => acc + (d.calories || 0), 0);
  const totalWater = merged.reduce((acc, d) => acc + (d.water_L || 0), 0);
  const avgCal = merged.length ? Math.round(totalCal / merged.length) : 0;

  const exportUrl = reportsService.getExportUrl(user?.id);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleExport = async () => {
    const res = await fetch(exportUrl, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'health-report.csv'; a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="gradient-text">Reports</h1>
          <p className="subtitle-caps">Historical overview</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {[7, 14, 30].map((d) => (
            <button key={d} className={`btn btn-sm ${days === d ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setDays(d)}>{d}d</button>
          ))}
          <button className="btn btn-admin btn-sm" onClick={handleExport}>⬇ Export CSV</button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Calories', value: totalCal.toLocaleString(), unit: 'kcal', color: '#f59e0b' },
          { label: 'Avg. Daily Calories', value: avgCal, unit: 'kcal/day', color: '#ec4899' },
          { label: 'Total Water', value: totalWater.toFixed(1), unit: 'L', color: '#3b82f6' },
        ].map((s) => (
          <GlassCard key={s.label} style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.unit}</div>
          </GlassCard>
        ))}
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          {/* Calorie chart */}
          <GlassCard style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>🔥 Calorie Trend</h3>
            {merged.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📈</div><p>No data yet — start logging meals!</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={merged} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fill: '#7c6fa0', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#7c6fa0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="calories" name="Calories (kcal)" fill="url(#calGrad)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Water chart */}
          <GlassCard style={{ padding: '28px' }}>
            <h3 style={{ marginBottom: '20px' }}>💧 Hydration Trend</h3>
            {merged.filter((d) => d.water_L).length === 0 ? (
              <div className="empty-state"><div className="empty-icon">💧</div><p>No water data yet.</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={merged} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fill: '#7c6fa0', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#7c6fa0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Line type="monotone" dataKey="water_L" name="Water (L)"
                    stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
