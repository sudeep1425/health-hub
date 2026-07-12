import React from 'react';

export default function EntryTable({ entries, type, onDelete, onEdit }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{type === 'food' ? '🍽️' : '💧'}</div>
        <p>No {type === 'food' ? 'food entries' : 'water logs'} for today yet.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {type === 'food' ? (
              <>
                <th>Food</th>
                <th>Calories</th>
                <th>Meal</th>
                <th>Date</th>
                <th>Actions</th>
              </>
            ) : (
              <>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              {type === 'food' ? (
                <>
                  <td style={{ fontWeight: 500 }}>{entry.food_name}</td>
                  <td>
                    <span className="badge badge-warning">{entry.calories} kcal</span>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {entry.meal_type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(entry.log_date).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onEdit && (
                        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(entry)}>✏️</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(entry.id)}>🗑️</button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <span className="badge badge-info">💧 {entry.quantity_ml} ml</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(entry.log_date).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(entry.id)}>🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
