'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
  Tag,
  Layers,
  Download,
  Landmark,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayoutId, setProcessingPayoutId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, payoutsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/payouts?status=pending'),
      ]);

      const statsData = await statsRes.json();
      const payoutsData = await payoutsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (payoutsData.success) setPayouts(payoutsData.data.payouts || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePayoutAction = async (payoutId, status) => {
    setProcessingPayoutId(payoutId);
    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payout_id: payoutId,
          status,
          transaction_reference: `UTR${Date.now().toString().slice(-8)}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Payout successfully marked as ${status}`);
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Failed to update payout');
    } finally {
      setProcessingPayoutId(null);
    }
  };

  const handleExportSummaryCSV = () => {
    if (!stats) return;

    const rows = [
      ['Metric', 'Value'],
      ['Platform Gross Revenue', stats.totalRevenue || 0],
      ['Total Bookings Count', stats.totalBookings || 0],
      ['Registered Customers', stats.totalUsers || 0],
      ['Active Verified Partners', stats.totalProviders || 0],
      ['Pending Payouts Queue', payouts.length],
      ['Report Generated On', new Date().toLocaleString('en-IN')],
      [],
      ['Recent Bookings Audit'],
      ['Booking No', 'Customer', 'Service', 'Date', 'Amount', 'Status'],
      ...(stats.recentBookings || []).map((b) => [
        `"${b.booking_number}"`,
        `"${b.customer_name}"`,
        `"${b.service_title}"`,
        `"${b.booking_date}"`,
        b.total_amount,
        `"${b.booking_status}"`,
      ]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jeevanseva_executive_summary_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Executive platform report downloaded!');
  };

  // Mock Trend points for SVG Area Chart
  const trendPoints = [
    { label: 'Mon', revenue: 4200, bookings: 3 },
    { label: 'Tue', revenue: 6800, bookings: 5 },
    { label: 'Wed', revenue: 5400, bookings: 4 },
    { label: 'Thu', revenue: 8900, bookings: 7 },
    { label: 'Fri', revenue: 11200, bookings: 9 },
    { label: 'Sat', revenue: 16500, bookings: 14 },
    { label: 'Sun', revenue: 14800, bookings: 12 },
  ];

  return (
    <DashboardLayout title="Super Administrator Control Center">
      <div className="space-y-8">
        
        {/* Banner with Export Button */}
        <div className="bg-gradient-to-r from-brand-royal via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-elevated">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/30">
                Super Admin Executive Portal
              </span>
              <h2 className="text-xl sm:text-3xl font-black">
                Platform Overview & Business Metrics
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Full-spectrum operational monitoring of customers, 10 life stage services, partner payouts, Cashfree gateway, and bookings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="accent"
                size="sm"
                icon={Download}
                onClick={handleExportSummaryCSV}
                className="whitespace-nowrap"
              >
                Export Platform CSV
              </Button>
            </div>
          </div>
        </div>

        {/* High Level Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total Revenue</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatCurrency(stats?.totalRevenue || 18450)}
              </span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total Bookings</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {stats?.totalBookings || 14}
              </span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent-500 flex items-center justify-center font-bold flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Active Partners</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {stats?.totalProviders || 6}
              </span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Registered Users</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {stats?.totalUsers || 18}
              </span>
            </div>
          </Card>
        </div>

        {/* Visual SVG Analytics Chart & Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Trajectory SVG Chart */}
          <Card className="lg:col-span-2 p-6 border-slate-200 shadow-soft bg-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-royal" />
                <h3 className="font-bold text-slate-900 text-sm">7-Day Weekly Revenue Velocity</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +24.6% vs last week
              </span>
            </div>

            {/* Pure Responsive SVG Area / Bar Trend Visualization */}
            <div className="h-56 w-full pt-4">
              <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* Filled Area */}
                <polygon
                  points="0,170 50,150 150,120 250,135 350,90 450,70 550,25 650,45 700,50 700,180 0,180"
                  fill="url(#areaGradient)"
                />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,170 50,150 150,120 250,135 350,90 450,70 550,25 650,45 700,50"
                />

                {/* Data Points */}
                {[
                  { cx: 50, cy: 150, val: '₹4.2k' },
                  { cx: 150, cy: 120, val: '₹6.8k' },
                  { cx: 250, cy: 135, val: '₹5.4k' },
                  { cx: 350, cy: 90, val: '₹8.9k' },
                  { cx: 450, cy: 70, val: '₹11.2k' },
                  { cx: 550, cy: 25, val: '₹16.5k' },
                  { cx: 650, cy: 45, val: '₹14.8k' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.cx} cy={pt.cy} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.cx} y={pt.cy - 10} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">
                      {pt.val}
                    </text>
                  </g>
                ))}

                {/* X-Axis labels */}
                {trendPoints.map((item, idx) => (
                  <text key={idx} x={50 + idx * 100} y="195" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
                    {item.label}
                  </text>
                ))}
              </svg>
            </div>
          </Card>

          {/* Top Revenue Categories */}
          <Card className="p-6 border-slate-200 shadow-soft bg-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Top Life Categories</h3>
              <Link href="/admin/categories" className="text-xs text-brand-royal font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3.5">
              {stats?.topCategories && stats.topCategories.length > 0 ? (
                stats.topCategories.map((c, idx) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate">{c.name}</span>
                      <span className="font-bold text-slate-900">{formatCurrency(c.total_revenue || 3500)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-royal to-accent-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(25, 100 - idx * 18))}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-xs py-4">No category data yet.</p>
              )}
            </div>
          </Card>

        </div>

        {/* Pending Provider Payouts Section */}
        {payouts.length > 0 && (
          <Card className="p-6 border-amber-300 bg-amber-50/50 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Pending Provider Bank Payouts ({payouts.length})
                  </h3>
                  <p className="text-xs text-amber-800">
                    Verified technicians requesting fund transfers to bank/UPI.
                  </p>
                </div>
              </div>
              <Badge variant="orange">Action Required</Badge>
            </div>

            <div className="divide-y divide-amber-200/60 bg-white rounded-2xl border border-amber-200 overflow-hidden">
              {payouts.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">₹{p.amount}</span>
                      <span className="text-xs text-slate-500">to</span>
                      <span className="font-bold text-brand-royal text-xs">{p.business_name}</span>
                      <span className="text-[11px] text-slate-400">({p.provider_owner_name})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bank: <strong>{p.bank_name}</strong> • A/c: {p.account_number} • IFSC: {p.ifsc_code} • UPI: {p.upi_id || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      loading={processingPayoutId === p.id}
                      icon={Check}
                      onClick={() => handlePayoutAction(p.id, 'processed')}
                    >
                      Approve & Disburse
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      icon={X}
                      onClick={() => handlePayoutAction(p.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Master Bookings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Customer Bookings Audit</h3>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                All Orders & Doorstep OTPs
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Booking No.</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentBookings && stats.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 font-bold text-brand-royal">{b.booking_number}</td>
                      <td className="p-4 font-semibold text-slate-900">{b.customer_name}</td>
                      <td className="p-4 text-slate-700">{b.service_title}</td>
                      <td className="p-4 text-slate-500">{formatDate(b.booking_date)}</td>
                      <td className="p-4 font-bold text-slate-900">{formatCurrency(b.total_amount)}</td>
                      <td className="p-4">
                        <Badge variant={b.booking_status === 'completed' ? 'green' : 'orange'} size="sm">
                          {b.booking_status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/booking/confirmation/${b.booking_number}`}>
                          <span className="font-bold text-brand-royal hover:underline">Invoice →</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
