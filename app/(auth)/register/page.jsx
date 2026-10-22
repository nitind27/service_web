'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Gift,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Star,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { validateEmail, validateIndianMobile } from '@/lib/utils';

export default function RegisterCustomerPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!mobile.trim() || !validateIndianMobile(mobile)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agree) {
      setErrorMsg('Please accept the Terms of Service to continue');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          city,
          password,
          role: 'customer',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Account created successfully! Welcome to JeevanSeva.');
        await refreshUser();
        router.push(data.data?.redirectUrl || '/user/dashboard');
      } else {
        setErrorMsg(data.message || 'Registration failed');
        toast.error(data.message);
      }
    } catch (err) {
      setErrorMsg('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
      
      {/* LEFT COLUMN: CUSTOMER PRIVILEGES & REWARDS */}
      <div className="lg:col-span-5 bg-gradient-to-br from-brand-royal via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>New Customer Welcome Benefits</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Join India’s Most Trusted <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100">
                Doorstep Life Network.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              Create an account in 60 seconds to unlock instant verified bookings, upfront pricing, and guaranteed peace of mind.
            </p>
          </div>

          {/* Special Welcome Offer Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-transparent p-4 rounded-2xl border border-amber-400/30 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> Flat ₹200 OFF First Order
            </div>
            <p className="text-xs text-white mt-1 font-semibold">
              Use code <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-amber-200 tracking-wider">JEEVAN200</strong> at checkout on any service.
            </p>
          </div>

          {/* Member Guarantees */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">30-Day Free Rework Guarantee</p>
                <p className="text-[11px] text-blue-200/70">Jeevan Suraksha policy covers 100% free re-inspections</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant Wallet Cashback & Refunds</p>
                <p className="text-[11px] text-blue-200/70">Instant refund processing directly into your JeevanSeva Wallet</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-400/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Doorstep 4-Digit Security OTP</p>
                <p className="text-[11px] text-blue-200/70">Zero unverified entries into your residence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <div>
            <p className="font-black text-white text-base">48,000+</p>
            <p className="text-[10px] text-slate-300">Registered Households</p>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <p className="font-black text-white text-base">28+ States</p>
            <p className="text-[10px] text-slate-300">Across India</p>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <p className="font-black text-white text-base">4.92 ★</p>
            <p className="text-[10px] text-slate-300">Verified Rating</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CUSTOMER REGISTRATION FORM */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-6 max-w-xl mx-auto w-full">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Free Sign Up
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Takes ~60 seconds
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Book verified home technicians, emergency assistance, and life services with upfront pricing.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Amitabh Roy"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="amitabh@gmail.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="10-Digit Mobile (+91)"
                placeholder="9811000007"
                icon={Phone}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />

              <Input
                label="City / Location"
                placeholder="e.g. New Delhi, Mumbai"
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password (min. 6 chars)"
                type="password"
                placeholder="Create password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded accent-brand-royal w-4 h-4"
              />
              <span className="leading-relaxed">
                I agree to JeevanSeva’s{' '}
                <Link href="/terms" className="text-brand-royal font-bold hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-royal font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full text-sm py-3.5 font-black shadow-md rounded-xl"
            >
              Create Account & Unlock ₹200 OFF
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">Already have an account?</span>
            <div className="flex items-center gap-3">
              <Link href="/login" className="font-bold text-brand-royal hover:underline">
                Sign In to Account
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/register/provider" className="font-bold text-accent-600 hover:underline">
                Join as Service Partner
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="text-center pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Your personal data is encrypted & never shared with third parties.</span>
        </div>

      </div>

    </div>
  );
}
