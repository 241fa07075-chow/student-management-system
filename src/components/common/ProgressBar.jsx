import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'var(--primary)',
  height = '8px',
  showLabel = false,
  labelPrefix = '',
  labelSuffix = '%'
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  // Dynamic color selection if color is not custom
  let barColor = color;
  if (color === 'auto') {
    if (percentage >= 85) barColor = 'var(--success)';
    else if (percentage >= 75) barColor = 'var(--primary)';
    else if (percentage >= 65) barColor = 'var(--warning)';
    else barColor = 'var(--danger)';
  }

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{labelPrefix}</span>
          <span style={{ color: 'var(--text-primary)' }}>{percentage}{labelSuffix}</span>
        </div>
      )}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--border-light)',
        borderRadius: '9999px',
        height: height,
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '9999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </div>
  );
};
