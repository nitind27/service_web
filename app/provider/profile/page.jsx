'use client';

import React, { useState, useEffect } from 'react';
import { Building, MapPin, Award, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function ProviderProfilePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [businessName, setBusinessName] = useState('Sharma AC & Electro Care');
  const [gst, setGst] = useState('07AAAAA0000A1Z5');
  const [experience, setExperience] = useState('9');
  const [city, setCity] = useState('New Delhi');
  const [serviceArea, setServiceArea] = useState('Delhi NCR, Noida, Gurugram');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Business profile updated successfully!');
      setSaving(false);
    }, 400);
  };

  return (
    <DashboardLayout title="Business Partner Profile">
      <div className="max-w-4xl space-y-6">
        
        {/* Verification Status Banner */}
        <Card className="p-6 border-emerald-200 bg-emerald-50/60 shadow-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-950">{businessName}</h3>
                <Badge variant="green" size="sm">Verified Partner</Badge>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Identity documents, Aadhaar verification, and police clearance approved.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-full border border-emerald-200">
            Active Status
          </span>
        </Card>

        {/* Edit Form */}
        <Card className="p-6 sm:p-8 border-slate-200 shadow-soft bg-white">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Business Registration Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registered Business Name"
                icon={Building}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
              <Input
                label="GSTIN Number (Optional)"
                placeholder="07AAAAA0000A1Z5"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Primary City"
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                label="Experience (Years)"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
              <Input
                label="Service Radius / Area"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="accent" size="md" loading={saving}>
                Save Business Profile
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </DashboardLayout>
  );
}
