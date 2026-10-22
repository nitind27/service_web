'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LogIn,
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  UserCheck,
  Clock,
  Star,
  Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export const dynamic = 'force-dynamic';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState('customer'); // 'customer' | 'provider' | 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectParam = searchParams.get('redirect') || '';

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!emailOrMobile.trim() || !password) {
      setErrorMsg('Please enter your email or mobile and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(emailOrMobile.trim(), password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        if (redirectParam) {
          router.push(redirectParam);
        } else {
          router.push(res.redirectUrl);
        }
      } else {
        setErrorMsg(res.message);
        toast.error(res.message);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (email, pass, roleTab) => {
    setEmailOrMobile(email);
    setPassword(pass);
    if (roleTab) setActiveRoleTab(roleTab);

    setTimeout(async () => {
      setLoading(true);
      setErrorMsg('');
      const res = await login(email, pass);
      if (res.success) {
        toast.success(`Logged in as ${res.user.role.toUpperCase()} (${res.user.name})`);
        if (redirectParam) {
          router.push(redirectParam);
        } else {
          router.push(res.redirectUrl);
        }
      } else {
        setErrorMsg(res.message);
        toast.error(res.message);
      }
      setLoading(false);
    }, 150);
  };

  return (
    <div className="bg-white rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
      
      {/* LEFT COLUMN: BRANDING & TRUST SHOWCASE */}
      <div className="lg:col-span-5 bg-gradient-to-br from-brand-royal via-blue-900 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Unified Life Ecosystem</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              One Secure Account. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-amber-200 to-orange-300">
                Endless Life Care Services.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              Book doorstep verified technicians, manage hospital dispatches, elderly care, tuition, and family services under one unified roof.
            </p>
          </div>

          {/* Key Value Propositions */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-400/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Police & Skill Verified</p>
                <p className="text-[11px] text-blue-200/70">Background checked technicians and professionals</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-400/30">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Doorstep 4-Digit Security OTP</p>
                <p className="text-[11px] text-blue-200/70">Work begins only when you share the arrival code</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">30-Day Free Rework Guarantee</p>
                <p className="text-[11px] text-blue-200/70">Jeevan Suraksha covers zero-cost re-inspections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Testimonial Widget */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex items-center gap-1.5 text-amber-300 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              ))}
              <span className="text-xs font-black text-white ml-1">4.92 / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-200 italic leading-snug">
              “Instant booking and total transparency. The doorstep OTP gave my family total peace of mind.”
            </p>
            <p className="text-[10px] text-blue-200 mt-2 font-semibold">
              — Sunita Kapoor, South Delhi (14 Bookings Completed)
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: LOGIN FORM & DEMO TRAY */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-6 max-w-md mx-auto w-full">
          
          {/* Header Title & Role Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-2.5 py-1 rounded-md">
                Secure Access
              </span>
              <span className="text-xs text-slate-400 font-medium">
                v2.4 Protected
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered mobile or email to access your dashboard.
            </p>
          </div>

          {/* Quick Role Toggle Bar */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveRoleTab('customer')}
              className={`py-2 rounded-lg transition-all ${
                activeRoleTab === 'customer'
                  ? 'bg-white text-brand-royal shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleTab('provider')}
              className={`py-2 rounded-lg transition-all ${
                activeRoleTab === 'provider'
                  ? 'bg-white text-accent-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Partner Pro
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleTab('admin')}
              className={`py-2 rounded-lg transition-all ${
                activeRoleTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Staff
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email Address or 10-Digit Mobile"
              placeholder="e.g. customer@jeevanseva.in"
              icon={Mail}
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your account password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded accent-brand-royal w-4 h-4" />
                <span>Stay signed in for 7 days</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-brand-royal font-bold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full text-sm py-3.5 font-black shadow-md rounded-xl"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">Need an account?</span>
            <div className="flex items-center gap-3">
              <Link href="/register" className="font-bold text-accent-600 hover:underline">
                Register as Customer
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/register/provider" className="font-bold text-brand-royal hover:underline">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>

        {/* 1-CLICK INSTANT EVALUATION DEMO TRAY */}
        <div className="max-w-md mx-auto w-full pt-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-accent-500" /> 1-Click Fast Login (Demo Accounts)
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Tap to auto-fill</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer@jeevanseva.in', 'Customer@123', 'customer')}
                className="p-2 rounded-xl bg-white border border-blue-200 hover:border-brand-royal text-left transition hover:shadow-xs group"
              >
                <span className="text-[9.5px] font-black uppercase text-brand-royal block truncate">Customer</span>
                <span className="text-[11px] font-bold text-slate-800 block truncate">Amitabh R.</span>
                <span className="text-[9.5px] text-slate-400 block truncate">User Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rajesh.provider@jeevanseva.in', 'Provider@123', 'provider')}
                className="p-2 rounded-xl bg-white border border-orange-200 hover:border-accent-500 text-left transition hover:shadow-xs group"
              >
                <span className="text-[9.5px] font-black uppercase text-accent-600 block truncate">Partner Pro</span>
                <span className="text-[11px] font-bold text-slate-800 block truncate">Rajesh S.</span>
                <span className="text-[9.5px] text-slate-400 block truncate">Tech Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('subadmin@jeevanseva.in', 'Subadmin@123', 'admin')}
                className="p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-500 text-left transition hover:shadow-xs group"
              >
                <span className="text-[9.5px] font-black uppercase text-purple-600 block truncate">Sub-Admin</span>
                <span className="text-[11px] font-bold text-slate-800 block truncate">Neha S.</span>
                <span className="text-[9.5px] text-slate-400 block truncate">Ops Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@jeevanseva.in', 'Admin@123', 'admin')}
                className="p-2 rounded-xl bg-white border border-rose-200 hover:border-rose-500 text-left transition hover:shadow-xs group"
              >
                <span className="text-[9.5px] font-black uppercase text-rose-600 block truncate">Super Admin</span>
                <span className="text-[11px] font-bold text-slate-800 block truncate">Admin</span>
                <span className="text-[9.5px] text-slate-400 block truncate">Full Control</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500 font-semibold">Loading secure portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
