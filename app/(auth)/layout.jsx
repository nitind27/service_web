import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 via-slate-50 to-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-royal to-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
            JS
          </div>
          <span className="text-xl font-black tracking-tight text-brand-royal">
            Jeevan<span className="text-accent-500">Seva</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          ← Back to Homepage
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10">
        {children}
      </main>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} JeevanSeva Marketplace India. Safe & 256-bit Encrypted.</p>
      </div>
    </div>
  );
}
