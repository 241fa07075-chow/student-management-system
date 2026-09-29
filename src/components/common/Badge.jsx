import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variantClass = `badge-${variant}`;
  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.5rem' } : {};

  return (
    <span className={`badge ${variantClass}`} style={sizeStyle}>
      {children}
    </span>
  );
};
