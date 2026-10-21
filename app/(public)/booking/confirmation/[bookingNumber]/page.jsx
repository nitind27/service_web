'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Printer,
  ArrowRight,
  PhoneCall,
  Download,
  Share2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${bookingNumber}`);
        const data = await res.json();
        if (data.success && data.data.booking) {
          setBooking(data.data.booking);
        }
      } catch (err) {
        console.error('Error fetching confirmation booking:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 font-semibold">Loading booking confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Booking details not found</h2>
        <Link href="/services">
          <Button variant="primary">Browse Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 print:p-0">
      
      {/* Top Success Banner */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
          <CheckCircle className="w-9 h-9" />
        </div>
        <Badge variant="green" size="md">Booking Successfully Placed</Badge>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank You, {booking.customer_name}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Your booking is confirmed. A verified service technician will arrive at your address during the selected time slot.
        </p>
      </div>

      {/* Invoice Card */}
      <Card className="p-6 sm:p-10 border-slate-200 shadow-elevated space-y-8 bg-white" id="printable-invoice">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand-royal text-white font-black text-sm flex items-center justify-center">
                JS
              </span>
              <span className="text-xl font-black tracking-tight text-brand-royal">
                Jeevan<span className="text-accent-500">Seva</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Official Tax Invoice & Service Receipt</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Booking Reference
            </span>
            <span className="text-base sm:text-lg font-black text-brand-royal">
              {booking.booking_number}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Booked on: {formatDate(booking.created_at)}
            </span>
          </div>
        </div>

        {/* Doorstep Service Security OTP Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-dashed border-amber-400 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-900">Doorstep Verification Code</h3>
                <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Fraud-Protection</span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Share this 4-digit security code with the technician <strong>only upon arrival</strong> to begin service.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-amber-300 shadow-sm flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-widest">{booking.service_otp || '4821'}</span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Service Tracking
            </span>
            <Badge variant={booking.payment_status === 'paid' ? 'green' : 'orange'}>
              Payment: {booking.payment_status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="text-xs font-bold block">1. Confirmed</span>
              <span className="text-[10px] text-emerald-600 font-medium">Order Placed</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              ['assigned', 'in_progress', 'completed'].includes(booking.booking_status)
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <span className="text-xs font-bold block">2. Assigned</span>
              <span className="text-[10px] text-slate-500 font-medium">{booking.provider_name || 'Allocating...'}</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              ['in_progress', 'completed'].includes(booking.booking_status)
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <span className="text-xs font-bold block">3. In Progress</span>
              <span className="text-[10px] text-slate-500 font-medium">At Doorstep</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              booking.booking_status === 'completed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <span className="text-xs font-bold block">4. Completed</span>
              <span className="text-[10px] text-slate-500 font-medium">30-Day Warranty</span>
            </div>
          </div>
        </div>

        {/* Schedule & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Service Appointment
            </span>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <p className="flex items-center gap-2 font-bold text-slate-900">
                <Calendar className="w-4 h-4 text-accent-500" />
                Date: {formatDate(booking.booking_date)}
              </p>
              <p className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-accent-500" />
                Time Slot: {booking.time_slot}
              </p>
              <p className="text-slate-500 pt-1">
                Technician will call 30 minutes before arrival.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Service Location
            </span>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900">{booking.customer_name} ({booking.customer_mobile})</p>
              <p className="text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-4 h-4 text-brand-royal flex-shrink-0 mt-0.5" />
                {booking.address_snapshot}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Booked Item Details
          </span>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4">Item & Package</th>
                  <th className="p-3 sm:p-4 text-center">Category</th>
                  <th className="p-3 sm:p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 sm:p-4">
                    <p className="font-bold text-slate-900 text-sm">{booking.service_title}</p>
                    {booking.variant_title && (
                      <p className="text-slate-500">Package: {booking.variant_title}</p>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-slate-600">
                    {booking.category_name}
                  </td>
                  <td className="p-3 sm:p-4 text-right font-bold text-slate-900">
                    {formatCurrency(booking.base_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Summary Box */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Base Amount:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(booking.base_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%):</span>
              <span className="font-semibold text-slate-900">{formatCurrency(booking.tax_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(booking.convenience_fee)}</span>
            </div>
            {booking.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({booking.coupon_code || 'Promo'}):</span>
                <span>-{formatCurrency(booking.discount_amount)}</span>
              </div>
            )}
            {parseFloat(booking.wallet_amount_used || 0) > 0 && (
              <div className="flex justify-between text-brand-royal font-bold">
                <span>Wallet Balance Applied:</span>
                <span>-{formatCurrency(booking.wallet_amount_used)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900">
              <span>Total Paid / Payable:</span>
              <span className="text-brand-royal">{formatCurrency(booking.total_amount)}</span>
            </div>
          </div>
        </div>

      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link href="/user/bookings">
          <Button variant="outline" size="md">
            View All My Bookings
          </Button>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" size="md" icon={Printer} onClick={handlePrint} className="flex-1 sm:flex-none">
            Print Tax Invoice
          </Button>
          <Link href="/services" className="flex-1 sm:flex-none">
            <Button variant="accent" size="md" icon={ArrowRight} iconPosition="right" className="w-full">
              Explore More Services
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
