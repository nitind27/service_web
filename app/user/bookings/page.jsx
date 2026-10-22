'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Printer,
  RefreshCw,
  XCircle,
  MessageSquare,
  Search,
  KeyRound,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import BookingChatModal from '@/components/common/BookingChatModal';
import LiveTrackingModal from '@/components/common/LiveTrackingModal';
import WarrantyClaimModal from '@/components/common/WarrantyClaimModal';
import Pagination from '@/components/ui/Pagination';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function UserBookingsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Live chat modal state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // Live tracking modal state
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingBooking, setTrackingBooking] = useState(null);

  // 30-Day Guarantee warranty modal state
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [warrantyBooking, setWarrantyBooking] = useState(null);

  const fetchBookings = useCallback(async (targetPage = page, tab = activeTab, query = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(pageSize),
      });
      if (tab && tab !== 'all') params.append('status', tab);
      if (query && query.trim()) params.append('q', query.trim());

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
        setTotalPages(data.meta?.totalPages || data.data?.totalPages || 1);
        setTotalCount(data.meta?.total || data.data?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, searchQuery, pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Bookings list (server-side paginated and filtered)
  const filteredBookings = bookings;

  // Handle Review Submission
  const handleSubmitReview = async () => {
    if (!selectedBookingForReview) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: selectedBookingForReview.id,
          rating,
          review_text: reviewText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Thank you for rating your service experience!');
        setReviewModalOpen(false);
        setReviewText('');
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Handle Cancellation
  const handleCancelBooking = async () => {
    if (!selectedBookingForCancel) return;
    setCancelSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBookingForCancel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          reason: cancelReason || 'Cancelled by customer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking cancelled successfully');
        setCancelModalOpen(false);
        setCancelReason('');
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="My Service Bookings">
      <div className="space-y-6">
        
        {/* Top Controls: Search + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'all', label: 'All Bookings', badge: bookings.length },
              {
                id: 'active',
                label: 'Upcoming & Active',
                badge: bookings.filter((b) => ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.booking_status)).length,
              },
              {
                id: 'completed',
                label: 'Completed',
                badge: bookings.filter((b) => b.booking_status === 'completed').length,
              },
              {
                id: 'cancelled',
                label: 'Cancelled',
                badge: bookings.filter((b) => b.booking_status === 'cancelled').length,
              },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setPage(1);
            }}
          />

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by ID or service..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 pl-8 outline-none focus:border-brand-royal"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-semibold">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-300 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no orders matching this filter. Explore our 10 life service categories to book an appointment!
            </p>
            <Link href="/services">
              <Button variant="accent" size="sm">Browse Services</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isCompleted = b.booking_status === 'completed';
              const isCancelled = b.booking_status === 'cancelled';
              const canCancel = ['pending', 'confirmed'].includes(b.booking_status);

              return (
                <Card
                  key={b.id}
                  className="p-5 sm:p-6 border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition"
                >
                  {/* Left Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={b.service_thumbnail || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200'}
                      alt={b.service_title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-brand-royal">
                          {b.booking_number}
                        </span>
                        <Badge
                          variant={isCompleted ? 'green' : isCancelled ? 'red' : 'blue'}
                          size="sm"
                        >
                          {b.booking_status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                          {b.category_name}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {b.service_title}
                      </h4>

                      {b.variant_title && (
                        <p className="text-xs text-slate-500 font-medium">Package: {b.variant_title}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-accent-500" />
                          {formatDate(b.booking_date)} • {b.time_slot}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {b.address_snapshot}
                        </span>
                      </div>

                      {!isCompleted && !isCancelled && b.service_otp && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 shadow-2xs">
                            <KeyRound className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>Doorstep Security OTP: <strong className="font-mono text-sm tracking-widest text-slate-900">{b.service_otp}</strong></span>
                            <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">Share on arrival</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-lg font-black text-slate-900">
                        {formatCurrency(b.total_amount)}
                      </span>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                        {b.payment_mode === 'cashfree' ? 'Cashfree Online' : 'Cash on Delivery'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/booking/confirmation/${b.booking_number}`}>
                        <Button variant="outline" size="sm" icon={Printer}>
                          Invoice
                        </Button>
                      </Link>

                      {/* Live GPS Track Button for Active Bookings */}
                      {!isCancelled && !isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Navigation}
                          className="text-brand-royal border-blue-300 bg-blue-50/60 hover:bg-blue-100/60"
                          onClick={() => {
                            setTrackingBooking(b);
                            setTrackingModalOpen(true);
                          }}
                        >
                          Live Track
                        </Button>
                      )}

                      {/* 30-Day Free Rework Guarantee Claim for Completed Bookings */}
                      {isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={ShieldCheck}
                          className="text-emerald-700 border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/60"
                          onClick={() => {
                            setWarrantyBooking(b);
                            setWarrantyModalOpen(true);
                          }}
                        >
                          Claim Guarantee
                        </Button>
                      )}

                      {!isCancelled && (
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
                      )}

                      {isCompleted && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Star}
                          onClick={() => {
                            setSelectedBookingForReview(b);
                            setReviewModalOpen(true);
                          }}
                        >
                          Review
                        </Button>
                      )}

                      {canCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            setSelectedBookingForCancel(b);
                            setCancelModalOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}

                      <Link href={`/book/${b.service_slug || 'full-home-deep-cleaning'}`}>
                        <Button variant="accent" size="sm" icon={RefreshCw}>
                          Rebook
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Bar */}
        {!loading && bookings.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            className="rounded-2xl border border-slate-200 shadow-soft"
          />
        )}

      </div>

      {/* RATING & REVIEW MODAL */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Rate Your Service Experience"
        size="md"
      >
        {selectedBookingForReview && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              How was your service for <strong>{selectedBookingForReview.service_title}</strong>?
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Write your honest review"
              placeholder="Tell others about the punctuality, cleanliness, and quality of work..."
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                loading={reviewSubmitting}
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CANCEL BOOKING MODAL */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Cancellation"
        size="sm"
      >
        {selectedBookingForCancel && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel booking <strong>{selectedBookingForCancel.booking_number}</strong>?
            </p>

            {selectedBookingForCancel.payment_status === 'paid' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                💰 Instant Refund: ₹{selectedBookingForCancel.total_amount} will be credited back to your JeevanSeva Wallet immediately upon cancellation.
              </div>
            )}

            <Textarea
              label="Reason for cancellation (Optional)"
              placeholder="e.g. Schedule changed, emergency at home..."
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setCancelModalOpen(false)}>
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={cancelSubmitting}
                onClick={handleCancelBooking}
              >
                Confirm Cancel
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

      {/* LIVE ROUTE & GPS TRACKING MODAL */}
      <LiveTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        booking={trackingBooking}
        onOpenChat={(b) => {
          setChatBooking(b);
          setChatModalOpen(true);
        }}
      />

      {/* 30-DAY FREE REWORK GUARANTEE MODAL */}
      <WarrantyClaimModal
        isOpen={warrantyModalOpen}
        onClose={() => setWarrantyModalOpen(false)}
        booking={warrantyBooking}
        onSuccess={() => fetchBookings()}
      />

    </DashboardLayout>
  );
}
