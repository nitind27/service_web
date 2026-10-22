'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Building,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { validateEmail, validateIndianMobile } from '@/lib/utils';

export default function RegisterProviderPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [categoryType, setCategoryType] = useState('Home & Appliances');
  const [experienceYears, setExperienceYears] = useState('5');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const serviceCategories = [
    'Home & Appliances',
    'Furniture & Carpentry',
    'Healthcare & Elder Care',
    'Education & Tutors',
    'Weddings & Events',
    'Vehicles & Transport',
    'Legal & Finance',
    'Beauty & Personal Care',
    'Agriculture & Business',
    'Last Rites & Cremation',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !businessName.trim()) {
      setErrorMsg('Please enter your full name and agency/business name');
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

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          city,
          category: categoryType,
          experienceYears,
          about: about.trim() || `${categoryType} specialist with ${experienceYears} years experience`,
          password,
          role: 'provider',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Partner registration approved! Welcome aboard.');
        await refreshUser();
        router.push(data.data?.redirectUrl || '/provider/dashboard');
      } else {
        setErrorMsg(data.message || 'Registration failed');
        toast.error(data.message);
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please check network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
      
      {/* LEFT COLUMN: PARTNER GROWTH & EARNINGS VALUE PROPOSITION */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-orange-400 text-xs font-bold border border-white/15">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Join 10,000+ Verified Service Partners</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Scale Your Earnings. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-white">
                Get Daily Bookings in Your City.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              No commission middlemen. Direct bookings from genuine households with guaranteed payouts and 24x7 support.
            </p>
          </div>

          {/* Earning Benchmark Card */}
          <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-transparent p-4 rounded-2xl border border-orange-400/30 backdrop-blur-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
              Average Monthly Partner Earnings
            </p>
            <p className="text-2xl font-black text-white mt-0.5">
              ₹45,000 – ₹95,000+ <span className="text-xs font-medium text-slate-300">/ month</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              Weekly automatic bank transfers with transparent digital receipts.
            </p>
          </div>

          {/* 4 Core Partner Guarantees */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-400/30">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Direct Weekly Bank Transfers</p>
                <p className="text-[11px] text-blue-200/70">NEFT/UPI payouts straight to your verified account</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Zero Fake Orders (OTP Protected)</p>
                <p className="text-[11px] text-blue-200/70">Every booking is confirmed with a 4-digit doorstep code</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-400/30">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dedicated Partner Helpdesk</p>
                <p className="text-[11px] text-blue-200/70">Priority support for dispatch scheduling & technical queries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <div>
            <p className="font-black text-white text-base">₹0</p>
            <p className="text-[10px] text-slate-300">Registration Fee</p>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <p className="font-black text-white text-base">10,000+</p>
            <p className="text-[10px] text-slate-300">Active Partners</p>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <p className="font-black text-white text-base">28+ States</p>
            <p className="text-[10px] text-slate-300">Service Coverage</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: PROVIDER ONBOARDING APPLICATION FORM */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-6 max-w-xl mx-auto w-full">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                Partner Onboarding
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Instant Verification
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Register as Service Partner
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Start receiving high-value customer orders in your area with fast weekly payouts.
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
            
            {/* Business & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Contact Name"
                placeholder="e.g. Rajesh Sharma"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Business / Agency Name"
                placeholder="e.g. Sharma AC & Electricals"
                icon={Building}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="partner@gmail.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="10-Digit Mobile (+91)"
                placeholder="9811000003"
                icon={Phone}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            {/* City & Trade Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Service City"
                placeholder="e.g. New Delhi, Noida"
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
                  Primary Trade / Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {serviceCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Experience & Skills Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Input
                  label="Experience (Yrs)"
                  type="number"
                  placeholder="5"
                  icon={Briefcase}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
                  Services Offered & Tools Overview
                </label>
                <input
                  type="text"
                  placeholder="e.g. Split AC jet cleaning, compressor repair, wiring"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Security Passwords */}
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

            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full text-sm py-3.5 font-black shadow-md rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
            >
              Submit Application & Start Receiving Bookings
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">Already registered as a partner?</span>
            <div className="flex items-center gap-3">
              <Link href="/login" className="font-bold text-brand-royal hover:underline">
                Sign In to Partner Portal
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/register" className="font-bold text-slate-600 hover:underline">
                Customer Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="text-center pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent 0% joining fees. Payouts verified via RBI-regulated banking partners.</span>
        </div>

      </div>

    </div>
  );
}
