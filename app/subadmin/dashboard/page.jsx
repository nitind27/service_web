'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Briefcase,
  Headphones,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingBookings: 1,
    totalBookings: 3,
    totalProviders: 4,
    openTickets: 1,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, bookRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/bookings?limit=6'),
        ]);
        const statsData = await statsRes.json();
        const bookData = await bookRes.json();

        if (statsData.success) {
          setStats({
            pendingBookings: statsData.data.pendingBookings || 1,
            totalBookings: statsData.data.totalBookings || 3,
            totalProviders: statsData.data.totalProviders || 4,
            openTickets: 1,
          });
        }
        if (bookData.success) {
          setRecentBookings(bookData.data.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Operations Sub-Admin Control">
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-elevated">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
              Operations Sub-Admin
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Operations Portal • {user?.name || 'Sub-Admin'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              Supervise booking fulfillment, allocate technicians to customers, review partner documents, and resolve customer support tickets.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent-500 flex items-center justify-center font-bold flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Pending Allocations</span>
              <span className="text-xl font-black text-slate-900">{stats.pendingBookings}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total Orders</span>
              <span className="text-xl font-black text-slate-900">{stats.totalBookings}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Active Providers</span>
              <span className="text-xl font-black text-slate-900">{stats.totalProviders}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Open Inquiries</span>
              <span className="text-xl font-black text-slate-900">{stats.openTickets}</span>
            </div>
          </Card>
        </div>

        {/* Operational Queues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/subadmin/bookings" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-royal shadow-soft hover:shadow-elevated transition flex items-center justify-between group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-royal">Manage Bookings</h4>
              <p className="text-xs text-slate-500">Assign technicians & update statuses</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-royal" />
          </Link>

          <Link href="/subadmin/providers" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-royal shadow-soft hover:shadow-elevated transition flex items-center justify-between group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-royal">Approve Partners</h4>
              <p className="text-xs text-slate-500">Verify documents & credentials</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-royal" />
          </Link>

          <Link href="/subadmin/tickets" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-royal shadow-soft hover:shadow-elevated transition flex items-center justify-between group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-royal">Support Tickets</h4>
              <p className="text-xs text-slate-500">Handle queries & disputes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-royal" />
          </Link>
        </div>

        {/* Recent Orders List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Customer Bookings</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Booking</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-brand-royal">{b.booking_number}</td>
                    <td className="p-4 font-semibold text-slate-900">{b.service_title}</td>
                    <td className="p-4 text-slate-600">{b.customer_name}</td>
                    <td className="p-4 text-slate-600">{b.provider_name || 'Unassigned'}</td>
                    <td className="p-4">
                      <Badge variant={b.booking_status === 'completed' ? 'green' : 'orange'} size="sm">
                        {b.booking_status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Link href="/subadmin/bookings">
                        <span className="font-bold text-brand-royal hover:underline">Manage →</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
