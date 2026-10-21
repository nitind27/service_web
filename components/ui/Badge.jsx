import React from 'react';

export default function Badge({
  children,
  variant = 'gray', // blue, green, orange, red, purple, gray
  size = 'md', // sm, md
  className = '',
}) {
  const variantStyles = {
    blue: 'bg-blue-50 text-brand-royal border-blue-200/80',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    orange: 'bg-orange-50 text-orange-700 border-orange-200/80',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.gray} ${className}`}
    >
      {children}
    </span>
  );
}
