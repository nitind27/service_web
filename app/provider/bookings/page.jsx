'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Play,
  CheckCheck,
  Search,
  Filter,
  MessageSquare,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import BookingChatModal from '@/components/common/BookingChatModal';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProviderBookingsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Start Job with OTP modal state
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedBookingForStart, setSelectedBookingForStart] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [startSubmitting, setStartSubmitting] = useState(false);

  // Complete modal state
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live Chat state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings?limit=50');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStartJobWithOtp = async () => {
    if (!selectedBookingForStart) return;
    if (!otpInput.trim() || otpInput.trim().length !== 4) {
      toast.error('Please enter the 4-digit Doorstep Service OTP from the customer');
      return;
    }

    setStartSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBookingForStart.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'in_progress',
          otp: otpInput.trim(),
          notes: 'Doorstep Security OTP verified. Service in progress.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Doorstep OTP verified! Service job started.');
        setStartModalOpen(false);
        setOtpInput('');
        fetchBookings();
      } else {
        toast.error(data.message || 'Invalid Doorstep Service OTP');
      }
    } catch (err) {
      toast.error('Failed to start job');
    } finally {
      setStartSubmitting(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus, notes = '') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking status changed to ${newStatus.toUpperCase()}`);
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleCompleteSubmit = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      await handleUpdateStatus(selectedBooking.id, 'completed', completionNotes || 'Job completed with customer satisfaction');
      setCompleteModalOpen(false);
      setCompletionNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'assigned' && !['assigned', 'confirmed', 'pending'].includes(b.booking_status)) return false;
    if (activeTab === 'in_progress' && b.booking_status !== 'in_progress') return false;
    if (activeTab === 'completed' && b.booking_status !== 'completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = b.booking_number?.toLowerCase().includes(q);
      const matchCust = b.customer_name?.toLowerCase().includes(q);
      const matchService = b.service_title?.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchService) return false;
    }
    return true;
  });

  return (
    <DashboardLayout title="Assigned Jobs & Work Orders">
      <div className="space-y-6">
        
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'all', label: 'All Jobs', badge: bookings.length },
              {
                id: 'assigned',
                label: 'To Do',
                badge: bookings.filter((b) => ['assigned', 'confirmed', 'pending'].includes(b.booking_status)).length,
              },
              {
                id: 'in_progress',
                label: 'In Progress',
                badge: bookings.filter((b) => b.booking_status === 'in_progress').length,
              },
              {
                id: 'completed',
                label: 'Completed',
                badge: bookings.filter((b) => b.booking_status === 'completed').length,
              },
            ]}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t)}
          />

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by customer or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 pl-8 outline-none focus:border-brand-royal"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-semibold">
            Loading assigned jobs...
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-300">
            <p className="text-xs text-slate-500">No jobs found under this category.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isAssigned = ['assigned', 'confirmed', 'pending'].includes(b.booking_status);
              const isInProgress = b.booking_status === 'in_progress';
              const isCompleted = b.booking_status === 'completed';

              return (
                <Card
                  key={b.id}
                  className="p-5 sm:p-6 border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-brand-royal">
                        {b.booking_number}
                      </span>
                      <Badge
                        variant={isCompleted ? 'green' : isInProgress ? 'orange' : 'blue'}
                        size="sm"
                      >
                        {b.booking_status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {b.payment_mode === 'cashfree' ? 'Pre-Paid Cashfree' : 'Collect COD'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{b.service_title}</h4>
                    {b.variant_title && (
                      <p className="text-xs text-slate-500 font-medium">Variant: {b.variant_title}</p>
                    )}

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          👤 {b.customer_name}
                        </span>
                        <a
                          href={`tel:${b.customer_mobile}`}
                          className="font-bold text-brand-royal flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-accent-500" /> {b.customer_mobile}
                        </a>
                      </div>
                      <p className="flex items-center gap-1 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-accent-500" />
                        Date: {formatDate(b.booking_date)} • Slot: <strong>{b.time_slot}</strong>
                      </p>
                      <p className="flex items-start gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        {b.address_snapshot}
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-xl font-black text-slate-900">
                        {formatCurrency(b.total_amount)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Net Payout: {formatCurrency(b.total_amount * 0.85)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => {
                          setChatBooking(b);
                          setChatModalOpen(true);
                        }}
                      >
                        Chat
                      </Button>

                      {isAssigned && (
                        <Button
                          variant="accent"
                          size="sm"
                          icon={Play}
                          onClick={() => {
                            setSelectedBookingForStart(b);
                            setOtpInput('');
                            setStartModalOpen(true);
                          }}
                        >
                          Verify OTP & Start
                        </Button>
                      )}

                      {isInProgress && (
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCheck}
                          onClick={() => {
                            setSelectedBooking(b);
                            setCompleteModalOpen(true);
                          }}
                        >
                          Mark Completed
                        </Button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Service Finished
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      {/* START JOB DOORSTEP OTP VERIFICATION MODAL */}
      <Modal
        isOpen={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        title="Doorstep OTP Verification"
        size="sm"
      >
        {selectedBookingForStart && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Anti-Fraud Customer Verification
              </p>
              <p className="text-amber-800 text-[11px]">
                Please ask customer <strong>{selectedBookingForStart.customer_name}</strong> for their 4-digit security OTP to begin service.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Enter 4-Digit Doorstep OTP</label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 4821"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-widest text-2xl font-mono font-black py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setStartModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                loading={startSubmitting}
                disabled={otpInput.length !== 4}
                onClick={handleStartJobWithOtp}
              >
                Verify & Begin Job
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MARK COMPLETED MODAL */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Complete Service Job"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Confirm completion for <strong>{selectedBooking.service_title}</strong> (Booking: {selectedBooking.booking_number}).
            </p>

            <Textarea
              label="Work Completion Notes & Feedback"
              placeholder="e.g. All AC filters cleaned, gas pressure tested, customer tested cooling..."
              rows={3}
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setCompleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="success"
                size="sm"
                loading={submitting}
                onClick={handleCompleteSubmit}
              >
                Confirm Completion & Bill
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* LIVE IN-APP CHAT DRAWER */}
      <BookingChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        bookingId={chatBooking?.id}
        bookingNumber={chatBooking?.booking_number}
        currentUserId={user?.id}
      />

    </DashboardLayout>
  );
}
