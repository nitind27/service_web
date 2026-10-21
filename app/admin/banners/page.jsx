'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminBannersPage() {
  const [banners] = useState([
    {
      id: 1,
      title: "India's Most Trusted Multi-Service Marketplace",
      subtitle: 'From newborn care to home deep cleaning & sacred ceremonies',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
      badge_text: 'Verified & Insured',
      status: 'active',
    },
    {
      id: 2,
      title: "Celebrate Life's Grand Occasions Stress-Free",
      subtitle: 'Book wedding planners, catering, decor, and photographers',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      badge_text: 'Up to 20% Off',
      status: 'active',
    },
  ]);

  return (
    <DashboardLayout title="Banners & Promotional Sliders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Homepage Banners</h2>
            <p className="text-xs text-slate-500">Manage promotional hero banners and festive highlights.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus}>
            Add Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <Card key={b.id} className="p-0 overflow-hidden border-slate-200 shadow-soft">
              <div className="h-44 bg-slate-100 relative">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant="orange" size="sm">{b.badge_text}</Badge>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
                <p className="text-xs text-slate-500">{b.subtitle}</p>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <Badge variant="green" size="sm">{b.status.toUpperCase()}</Badge>
                  <button className="text-xs text-rose-500 font-semibold hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
