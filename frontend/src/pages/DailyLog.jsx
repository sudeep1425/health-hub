import React, { useState } from 'react';
import { useDietLogs } from '../hooks/useDietLogs';
import { useWaterIntake } from '../hooks/useWaterIntake';
import FoodEntryForm from '../components/FoodEntryForm';
import WaterEntryForm from '../components/WaterEntryForm';
import EntryTable from '../components/EntryTable';
import GlassCard from '../components/GlassCard';

const TABS = ['Food Log', 'Water Log'];

export default function DailyLog({ user, onNewAchievements }) {
  const [tab, setTab] = useState('Food Log');
  const [editingEntry, setEditingEntry] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const { logs: dietLogs, addLog: addDiet, updateLog, deleteLog: deleteDiet, loading: dietLoading } = useDietLogs(user?.id);
  const { logs: waterLogs, addLog: addWater, deleteLog: deleteWater, dailyMl } = useWaterIntake(user?.id);

  const today = new Date().toISOString().split('T')[0];
  const todayDiet = dietLogs.filter((l) => l.log_date?.startsWith(today));
  const todayWater = waterLogs.filter((l) => l.log_date?.startsWith(today));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddFood = async (data) => {
    setSubmitting(true);
    try {
      const res = await addDiet(data);
      if (res.newAchievements?.length) {
        res.newAchievements.forEach((a) => showToast(`🏆 Achievement unlocked: ${a}!`));
        onNewAchievements?.();
      } else {
        showToast('✅ Food entry added!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFood = async (data) => {
    setSubmitting(true);
    try {
      await updateLog(editingEntry.id, data);
      setEditingEntry(null);
      showToast('✏️ Entry updated!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWater = async (data) => {
    setSubmitting(true);
    try {
      const res = await addWater(data);
      if (res.newAchievements?.length) {
        res.newAchievements.forEach((a) => showToast(`🏆 Achievement unlocked: ${a}!`));
      } else {
        showToast(`💧 Water logged! Today: ${res.dailyWaterMl}ml`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      {toast && <div className="alert-toast">{toast}</div>}

      <div className="page-header">
        <h1 className="gradient-text">Daily Log</h1>
        <p className="subtitle-caps">Track your intake</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((t) => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setTab(t); setEditingEntry(null); }}>
            {t === 'Food Log' ? '🍽️' : '💧'} {t}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Form panel */}
        <GlassCard style={{ padding: '28px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {tab === 'Food Log'
              ? editingEntry ? '✏️ Edit Entry' : '➕ Add Food Entry'
              : '💧 Log Water'}
          </h3>
          {tab === 'Food Log' ? (
            <FoodEntryForm
              onSubmit={editingEntry ? handleUpdateFood : handleAddFood}
              loading={submitting}
              initialData={editingEntry}
              onCancel={editingEntry ? () => setEditingEntry(null) : null}
            />
          ) : (
            <WaterEntryForm onSubmit={handleAddWater} loading={submitting} />
          )}
        </GlassCard>

        {/* Today's summary mini card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'Food Log' && (
            <GlassCard style={{ padding: '24px' }}>
              <p className="subtitle-caps" style={{ marginBottom: '12px' }}>Today's Calories</p>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--warning)' }}>
                {todayDiet.reduce((acc, l) => acc + l.calories, 0)}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}> kcal</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {todayDiet.length} meal{todayDiet.length !== 1 ? 's' : ''} logged
              </p>
            </GlassCard>
          )}
          {tab === 'Water Log' && (
            <GlassCard style={{ padding: '24px' }}>
              <p className="subtitle-caps" style={{ marginBottom: '12px' }}>Today's Hydration</p>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6' }}>
                {(dailyMl / 1000).toFixed(1)}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}> L</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: '999px',
                height: '8px', overflow: 'hidden', marginTop: '12px',
              }}>
                <div style={{
                  height: '100%', width: `${Math.min(dailyMl / 2000 * 100, 100)}%`,
                  background: 'var(--gradient-stat-2)', borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Goal: 2.0 L/day
              </p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Table */}
      <GlassCard style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Today's {tab === 'Food Log' ? 'Meals' : 'Water Intake'}</h3>
        {tab === 'Food Log' ? (
          <EntryTable
            entries={todayDiet}
            type="food"
            onDelete={deleteDiet}
            onEdit={(entry) => { setEditingEntry(entry); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        ) : (
          <EntryTable entries={todayWater} type="water" onDelete={deleteWater} />
        )}
      </GlassCard>
    </div>
  );
}
