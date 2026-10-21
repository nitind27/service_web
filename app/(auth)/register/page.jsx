'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
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
        toast.success(data.message || 'Account created successfully!');
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
    <div className="w-full max-w-md space-y-6">
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated space-y-6 bg-white">
        <div className="text-center space-y-1">
          <Badge variant="blue" size="sm">Customer Registration</Badge>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Book verified home, family, and life care services instantly.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            label="10-Digit Mobile Number"
            placeholder="9811000007"
            icon={Phone}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <Input
            label="City"
            placeholder="e.g. New Delhi, Mumbai"
            icon={MapPin}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

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

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 pt-1">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 rounded accent-brand-royal"
            />
            <span>
              I agree to JeevanSeva’s{' '}
              <Link href="/terms" className="text-brand-royal underline font-semibold">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-royal underline font-semibold">Privacy Policy</Link>.
            </span>
          </label>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            loading={loading}
            className="w-full text-base py-3.5 font-bold"
          >
            Create Customer Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-royal hover:underline">
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
}
