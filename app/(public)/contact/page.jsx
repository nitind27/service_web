'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export default function ContactUsPage() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error('Please fill in your name, phone number, and message');
      return;
    }
    toast.success('Your message has been sent to our customer care team!');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
          We Are Here For You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch with JeevanSeva
        </h1>
        <p className="text-sm text-slate-600">
          Need help with an ongoing booking, want to partner with us, or have special requirements? We respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info cards */}
        <div className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent-500 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">24x7 Customer Helpline</h3>
            <p className="text-xs text-slate-500">Available day and night for emergencies and queries.</p>
            <a href="tel:+919876543210" className="text-sm font-bold text-accent-600 block hover:underline">
              +91 98765 43210
            </a>
          </Card>

          <Card className="p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
            <p className="text-xs text-slate-500">Expect replies within 2 hours on business days.</p>
            <a href="mailto:support@jeevanseva.in" className="text-sm font-bold text-brand-royal block hover:underline">
              support@jeevanseva.in
            </a>
          </Card>

          <Card className="p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Headquarters</h3>
            <p className="text-xs text-slate-500">
              JeevanSeva Towers, 4th Floor, Sector 62, Noida, Delhi NCR - 201301
            </p>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-10 border-slate-200 shadow-soft">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out. One of our customer care managers will call you shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Send Us an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  placeholder="ramesh@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Textarea
                  label="How can we help you?"
                  placeholder="Describe your inquiry, booking reference, or service required..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <Button type="submit" variant="accent" size="lg" icon={Send} iconPosition="right" className="w-full sm:w-auto">
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
