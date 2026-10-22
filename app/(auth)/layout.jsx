import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, ArrowLeft, Sparkles, Lock } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-royal to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              JS
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-brand-royal block leading-none">
                Jeevan<span className="text-accent-500">Seva</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                All-in-One Life Services
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted Portal</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-700 hover:text-brand-royal font-bold border border-slate-200 hover:border-brand-royal transition shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Auth Content Stage */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} JeevanSeva Marketplace India. Safe & Trusted Doorstep Services across 28+ States.</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link href="/terms" className="hover:text-brand-royal hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-royal hover:underline">Privacy Policy</Link>
            <span>•</span>
            <a href="tel:+919876543210" className="flex items-center gap-1 text-accent-600 hover:underline">
              <PhoneCall className="w-3 h-3" /> 24x7 Helpline
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
