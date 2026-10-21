'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Wallet,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Wrench,
  HeartPulse,
  KeyRound,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [bookRes, walletRes] = await Promise.all([
          fetch('/api/bookings?limit=5'),
          fetch('/api/user/wallet'),
        ]);

        const bookData = await bookRes.json();
        const walletData = await walletRes.json();

        if (bookData.success) {
          setBookings(bookData.data.bookings || []);
        }
        if (walletData.success) {
          setWalletBalance(parseFloat(walletData.data.balance || 0));
        }
      } catch (err) {
        console.error('Error fetching dashboard bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const activeBookings = bookings.filter((b) =>
    ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.booking_status)
  );
  const completedBookings = bookings.filter((b) => b.booking_status === 'completed');

  return (
    <DashboardLayout title="Customer Dashboard">
      <div className="space-y-8">
        
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-brand-royal via-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-elevated">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 bg-blue-800/80 px-2.5 py-1 rounded-full">
              Customer Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Namaste, {user?.name || 'Customer'}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Track your scheduled appointments, view invoices, manage saved delivery addresses, or book verified experts anytime.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total Bookings</span>
              <span className="text-xl font-black text-slate-900">{bookings.length}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent-500 flex items-center justify-center font-bold flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Active Jobs</span>
              <span className="text-xl font-black text-slate-900">{activeBookings.length}</span>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Completed</span>
              <span className="text-xl font-black text-slate-900">{completedBookings.length}</span>
            </div>
          </Card>

          <Link href="/user/wallet" className="block">
            <Card className="p-5 border-slate-200 hover:border-brand-royal transition-all flex items-center gap-4 bg-white hover:shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Wallet Balance</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(walletBalance)}</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Active Appointments Alert (if any) */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-500" /> Active Appointments ({activeBookings.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBookings.map((b) => (
                <Card key={b.id} className="p-5 border-slate-200 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {b.booking_number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{b.service_title}</h4>
                      {b.variant_title && (
                        <p className="text-xs text-slate-500">{b.variant_title}</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={b.booking_status === 'confirmed' ? 'green' : 'orange'}>
                        {b.booking_status.toUpperCase()}
                      </Badge>
                      {b.service_otp && (
                        <span className="block font-mono text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                          OTP: {b.service_otp}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-accent-500" />
                      {formatDate(b.booking_date)} • {b.time_slot}
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {b.address_snapshot}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(b.total_amount)}
                    </span>
                    <Link href={`/booking/confirmation/${b.booking_number}`}>
                      <Button variant="outline" size="sm">
                        View Tracking & Invoice
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Bookings Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Service Bookings</h3>
            <Link href="/user/bookings">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
            {bookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-slate-500">You haven’t booked any services yet.</p>
                <Link href="/services">
                  <Button variant="accent" size="sm">Explore Services</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Booking No.</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Appointment</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-4 font-bold text-brand-royal whitespace-nowrap">
                          {b.booking_number}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900 line-clamp-1">{b.service_title}</p>
                          <span className="text-[10px] text-slate-400">{b.category_name}</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-600">
                          {formatDate(b.booking_date)}
                          <span className="text-[10px] text-slate-400 block">{b.time_slot}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(b.total_amount)}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <Badge
                            variant={
                              b.booking_status === 'completed'
                                ? 'green'
                                : b.booking_status === 'cancelled'
                                ? 'red'
                                : 'blue'
                            }
                            size="sm"
                          >
                            {b.booking_status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <Link href={`/booking/confirmation/${b.booking_number}`}>
                            <span className="text-xs font-bold text-brand-royal hover:underline">
                              Invoice →
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
