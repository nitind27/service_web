'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Wallet, ShieldCheck, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setCity(user.city || 'New Delhi');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, city }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile details updated successfully!');
        await refreshUser();
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Profile Settings">
      <div className="max-w-4xl space-y-6">
        
        {/* User Card */}
        <Card className="p-6 border-slate-200 shadow-soft flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white">
          <div className="w-20 h-20 rounded-full bg-brand-royal text-white flex items-center justify-center font-black text-2xl uppercase shadow-md">
            {name?.[0] || 'U'}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <Badge variant="blue" size="sm">{user?.role?.toUpperCase()}</Badge>
            </div>
            <p className="text-xs text-slate-500">{email}</p>
            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-accent-500" /> Primary City: {city || 'New Delhi'}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center sm:text-right">
            <span className="text-[10px] font-bold uppercase text-purple-700 block">JeevanSeva Wallet</span>
            <span className="text-xl font-black text-purple-900">₹{user?.wallet_balance || 0}</span>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="p-6 sm:p-8 border-slate-200 shadow-soft bg-white">
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Registered Mobile"
                icon={Phone}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                icon={Mail}
                value={email}
                disabled
                helperText="Email cannot be changed directly for account security"
              />
              <Input
                label="Primary City"
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="accent" size="md" icon={Save} loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Security & Support Box */}
        <Card className="p-5 border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-600">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Security & Protection
          </h4>
          <p>
            Your account is secured with 256-bit SSL encryption and HTTP-only JWT cookies. For any security inquiries or data requests, contact our privacy desk at <strong>care@jeevanseva.in</strong>.
          </p>
        </Card>

      </div>
    </DashboardLayout>
  );
}
