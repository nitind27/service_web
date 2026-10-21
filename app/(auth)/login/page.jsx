'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Lock, Mail, ShieldAlert, Sparkles, Check, KeyRound } from 'lucide-react';
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

  const handleQuickDemoLogin = (email, pass) => {
    setEmailOrMobile(email);
    setPassword(pass);
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
    <div className="w-full max-w-md space-y-6">
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated space-y-6 bg-white">
        <div className="text-center space-y-1">
          <Badge variant="blue" size="sm">Secure Sign In</Badge>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to JeevanSeva
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to manage bookings, track requests, or oversee services.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            label="Email or 10-Digit Mobile"
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
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" defaultChecked className="rounded accent-brand-royal" />
              <span>Remember me</span>
            </label>
            <span className="text-brand-royal font-semibold hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full text-base py-3.5 font-bold"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          <p>
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-accent-600 hover:underline">
              Create Customer Account
            </Link>
          </p>
          <p>
            Are you a service technician?{' '}
            <Link href="/register/provider" className="font-bold text-brand-royal hover:underline">
              Register as Partner
            </Link>
          </p>
        </div>
      </Card>

      <Card className="p-5 border-blue-200 bg-blue-50/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-royal uppercase tracking-wider">
          <KeyRound className="w-4 h-4 text-brand-royal" />
          <span>1-Click Demo Login (Instant Evaluation)</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-normal">
          Click any role below to automatically fill credentials and log into its dedicated dashboard:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin@jeevanseva.in', 'Admin@123')}
            className="p-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-left transition hover:shadow-xs group"
          >
            <span className="text-[10px] font-black uppercase text-rose-600 block">Super Admin</span>
            <span className="text-xs font-bold text-slate-800 block truncate">admin@jeevanseva.in</span>
            <span className="text-[10px] text-slate-400">Pass: Admin@123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('subadmin@jeevanseva.in', 'Subadmin@123')}
            className="p-2.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 text-left transition hover:shadow-xs group"
          >
            <span className="text-[10px] font-black uppercase text-purple-600 block">Sub-Admin</span>
            <span className="text-xs font-bold text-slate-800 block truncate">subadmin@jeevanseva.in</span>
            <span className="text-[10px] text-slate-400">Pass: Subadmin@123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('rajesh.provider@jeevanseva.in', 'Provider@123')}
            className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition hover:shadow-xs group"
          >
            <span className="text-[10px] font-black uppercase text-orange-600 block">Service Provider</span>
            <span className="text-xs font-bold text-slate-800 block truncate">rajesh.provider@...</span>
            <span className="text-[10px] text-slate-400">Pass: Provider@123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('customer@jeevanseva.in', 'Customer@123')}
            className="p-2.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 text-left transition hover:shadow-xs group"
          >
            <span className="text-[10px] font-black uppercase text-brand-royal block">Customer User</span>
            <span className="text-xs font-bold text-slate-800 block truncate">customer@jeevanseva.in</span>
            <span className="text-[10px] text-slate-400">Pass: Customer@123</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-semibold">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
