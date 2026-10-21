import React from 'react';
import Card from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Privacy & Data Security Policy</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <Card className="p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Data We Collect</h2>
          <p>
            We collect personal details such as customer name, verified 10-digit mobile number, email address, and service delivery location to enable doorstep fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Sharing with Service Partners</h2>
          <p>
            Your address and phone number are shared exclusively with the assigned background-verified service partner on the scheduled date for location coordination. We never sell customer data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Payment Information</h2>
          <p>
            We do not store your credit card, debit card, or UPI PIN numbers on our servers. All sensitive card processing is handled directly by Cashfree Payment Gateway.
          </p>
        </section>
      </Card>
    </div>
  );
}
