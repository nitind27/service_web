'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    grossRevenue: 0,
    netEarnings: 0,
    commissionRate: 15,
    rating: 4.9,
    totalReviews: 48,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviderData() {
      try {
        const [earnRes, bookRes] = await Promise.all([
          fetch('/api/provider/earnings'),
          fetch('/api/bookings?limit=6'),
        ]);

        const earnData = await earnRes.json();
        const bookData = await bookRes.json();

        if (earnData.success && earnData.data.stats) {
          setStats(earnData.data.stats);
        }
        if (bookData.success) {
          setBookings(bookData.data.bookings || []);
        }
      } catch (err) {
        console.error('Error fetching provider dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviderData();
  }, []);

  const pendingBookings = bookings.filter((b) => ['assigned', 'confirmed'].includes(b.booking_status));
  const activeJobs = bookings.filter((b) => b.booking_status === 'in_progress');

  return (
    <DashboardLayout title="Service Partner Dashboard">
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-elevated">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-300 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-500/30">
              Verified Service Partner
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Welcome, {user?.name || 'Partner'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage incoming customer requests, navigate to job sites, update service progress, and track your weekly net payouts.
            </p>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Net Earnings</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(stats.netEarnings || 8500)}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Jobs Completed</span>
              <span className="text-xl font-black text-slate-900">{stats.totalJobs || 12}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Partner Rating</span>
              <span className="text-xl font-black text-slate-900">{stats.rating || 4.9} ★</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Commission Rate</span>
              <span className="text-xl font-black text-slate-900">{stats.commissionRate || 15}%</span>
            </div>
          </Card>
        </div>

        {/* Incoming Job Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-500" /> Incoming / Assigned Bookings
            </h3>
            <Link href="/provider/bookings">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All Jobs
              </Button>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-300">
              <p className="text-xs text-slate-500">No active bookings currently assigned to your account.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.slice(0, 4).map((b) => (
                <Card key={b.id} className="p-5 border-slate-200 shadow-soft space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-brand-royal uppercase">{b.booking_number}</span>
                      <h4 className="text-sm font-bold text-slate-900">{b.service_title}</h4>
                      {b.variant_title && <p className="text-xs text-slate-500">{b.variant_title}</p>}
                    </div>
                    <Badge variant={b.booking_status === 'completed' ? 'green' : 'orange'}>
                      {b.booking_status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Customer: {b.customer_name} ({b.customer_mobile})
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-500" />
                      {formatDate(b.booking_date)} • {b.time_slot}
                    </p>
                    <p className="text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.address_snapshot}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(b.total_amount)}
                    </span>
                    <Link href="/provider/bookings">
                      <Button variant="accent" size="sm">
                        Update Status →
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
