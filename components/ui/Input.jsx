'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  autoComplete,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`block w-full rounded-xl border text-sm transition-all duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : 'px-3.5'
          } ${isPassword ? 'pr-10' : Icon ? 'pr-3.5' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
              : 'border-slate-300 text-slate-900 focus:border-brand-royal focus:ring-blue-100 bg-white hover:border-slate-400'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
