'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Building, User, Mail, Phone, Lock, MapPin, AlertCircle, Sparkles } from 'lucide-react';
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
  const [experienceYears, setExperienceYears] = useState('5');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !businessName.trim()) {
      setErrorMsg('Please enter your full name and business name');
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
          experienceYears,
          about: about.trim(),
          password,
          role: 'provider',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Provider partner registration submitted!');
        await refreshUser();
        router.push(data.data?.redirectUrl || '/provider/dashboard');
      } else {
        setErrorMsg(data.message || 'Registration failed');
        toast.error(data.message);
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated space-y-6 bg-white">
        <div className="text-center space-y-1">
          <Badge variant="orange" size="sm">Partner With Us</Badge>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Register as Service Partner
          </h2>
          <p className="text-xs text-slate-500">
            Get assigned genuine customer bookings in your city with weekly payouts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
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
              label="10-Digit Mobile"
              placeholder="9811000003"
              icon={Phone}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary City"
              placeholder="e.g. New Delhi"
              icon={MapPin}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="5"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Brief About Your Experience & Services Offered"
            placeholder="e.g. Certified technician with 9 years experience in residential AC repairs and home electrical wiring..."
            rows={2}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password (min. 6 characters)"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
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
            className="w-full text-base py-3.5 font-bold"
          >
            Submit Partner Application
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Already registered as a partner?{' '}
          <Link href="/login" className="font-bold text-brand-royal hover:underline">
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
}
