import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend }) => {
  const colorMap = {
    blue: {
      bg: 'rgba(37, 99, 235, 0.1)',
      text: '#2563eb',
      border: 'rgba(37, 99, 235, 0.2)'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.1)',
      text: '#10b981',
      border: 'rgba(16, 185, 129, 0.2)'
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.1)',
      text: '#8b5cf6',
      border: 'rgba(139, 92, 246, 0.2)'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.1)',
      text: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.2)'
    },
    rose: {
      bg: 'rgba(239, 68, 68, 0.1)',
      text: '#ef4444',
      border: 'rgba(239, 68, 68, 0.2)'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.1)',
      text: '#06b6d4',
      border: 'rgba(6, 182, 212, 0.2)'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div style={{ flex: 1, marginRight: '0.75rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {trend && <span style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginRight: '0.25rem' }}>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>}
            {subtitle}
          </p>
        )}
      </div>
      {Icon && (
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: scheme.bg,
          color: scheme.text,
          border: `1px solid ${scheme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
