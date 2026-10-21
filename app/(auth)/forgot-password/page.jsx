'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrMobile.trim()) {
      toast.error('Please enter your registered email or mobile');
      return;
    }
    setSubmitted(true);
    toast.success('Password reset instructions sent to your registered contact!');
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated space-y-6 bg-white">
        <div className="text-center space-y-1">
          <Badge variant="blue" size="sm">Account Recovery</Badge>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your registered email address or mobile number.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">OTP / Reset Link Sent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We have dispatched a verification code to <strong>{emailOrMobile}</strong>. Please check your SMS or email inbox.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="md">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email or 10-Digit Mobile"
              placeholder="e.g. customer@jeevanseva.in"
              icon={Mail}
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
            />

            <Button type="submit" variant="accent" size="lg" className="w-full text-base py-3.5 font-bold">
              Send Password Reset Instructions
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-brand-royal hover:underline">
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
}
