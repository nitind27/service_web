'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, CreditCard, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [siteName, setSiteName] = useState('JeevanSeva - All-in-One Life Services');
  const [tagline, setTagline] = useState('Every Service You Need — From Birth to Beyond');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState('care@jeevanseva.in');
  const [commission, setCommission] = useState('15');
  const [gst, setGst] = useState('5');
  const [convenienceFee, setConvenienceFee] = useState('49');
  const [cashfreeMode, setCashfreeMode] = useState('TEST');
  const [cashfreeAppId, setCashfreeAppId] = useState('TEST103432924fa69fa1eb6832db73b29234301');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.data.settings) {
          const s = data.data.settings;
          if (s.site_name) setSiteName(s.site_name);
          if (s.site_tagline) setTagline(s.site_tagline);
          if (s.support_phone) setSupportPhone(s.support_phone);
          if (s.support_email) setSupportEmail(s.support_email);
          if (s.platform_commission) setCommission(s.platform_commission);
          if (s.gst_percentage) setGst(s.gst_percentage);
          if (s.convenience_fee) setConvenienceFee(s.convenience_fee);
          if (s.cashfree_mode) setCashfreeMode(s.cashfree_mode);
          if (s.cashfree_app_id) setCashfreeAppId(s.cashfree_app_id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            site_name: siteName,
            site_tagline: tagline,
            support_phone: supportPhone,
            support_email: supportEmail,
            platform_commission: commission,
            gst_percentage: gst,
            convenience_fee: convenienceFee,
            cashfree_mode: cashfreeMode,
            cashfree_app_id: cashfreeAppId,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Marketplace settings updated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Marketplace Configuration & Settings">
      <div className="max-w-4xl space-y-6">
        
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* General Site Identity */}
          <Card className="p-6 sm:p-8 border-slate-200 shadow-soft bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-royal" /> General Identity & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marketplace Brand Name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                required
              />
              <Input
                label="Site Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Helpline Phone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
              />
              <Input
                label="Support Email Desk"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Financial & Commission Rates */}
          <Card className="p-6 sm:p-8 border-slate-200 shadow-soft bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Platform Financial Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Default Partner Commission (%)"
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                required
              />
              <Input
                label="GST Tax Rate (%)"
                type="number"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                required
              />
              <Input
                label="Safety & Convenience Fee (₹)"
                type="number"
                value={convenienceFee}
                onChange={(e) => setConvenienceFee(e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Cashfree Payment Gateway Settings */}
          <Card className="p-6 sm:p-8 border-slate-200 shadow-soft bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" /> Cashfree Payment Gateway Config
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Gateway Environment"
                value={cashfreeMode}
                onChange={(e) => setCashfreeMode(e.target.value)}
                options={[
                  { value: 'TEST', label: 'TEST (Sandbox Sandbox Mode)' },
                  { value: 'PROD', label: 'PROD (Production Live Gateway)' },
                ]}
                required
              />
              <Input
                label="Cashfree App ID (Client ID)"
                value={cashfreeAppId}
                onChange={(e) => setCashfreeAppId(e.target.value)}
                required
              />
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="accent" size="lg" icon={Save} loading={saving}>
              Save Marketplace Settings
            </Button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}
