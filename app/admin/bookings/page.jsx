'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Search,
  Filter,
  DollarSign,
  Download,
  MessageSquare,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import BookingChatModal from '@/components/common/BookingChatModal';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminBookingsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Status & Provider assign modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [newStatus, setNewStatus] = useState('confirmed');
  const [submitting, setSubmitting] = useState(false);

  // Live Chat state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const fetchBookings = useCallback(async (targetPage = page, status = statusFilter, query = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(pageSize),
      });
      if (status && status !== 'all') params.append('status', status);
      if (query && query.trim()) params.append('q', query.trim());

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
        setTotalPages(data.meta?.totalPages || data.data?.totalPages || 1);
        setTotalCount(data.meta?.total || data.data?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery, pageSize]);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/admin/providers');
      const data = await res.json();
      if (data.success) {
        setProviders(data.data.providers || []);
        if (data.data.providers?.length > 0) {
          setSelectedProviderId(String(data.data.providers[0].id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProviders();
  }, [fetchBookings]);

  const handleUpdate = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: selectedProviderId ? parseInt(selectedProviderId, 10) : undefined,
          status: newStatus,
          notes: 'Status updated by Super Administrator',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking updated successfully!');
        setModalOpen(false);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) {
      toast.error('No bookings data available to export');
      return;
    }

    const headers = [
      'Booking Number',
      'Doorstep OTP',
      'Customer Name',
      'Customer Mobile',
      'Service Title',
      'Category',
      'Booking Date',
      'Time Slot',
      'Base Amount',
      'Tax Amount',
      'Convenience Fee',
      'Discount',
      'Wallet Used',
      'Total Amount',
      'Payment Mode',
      'Payment Status',
      'Booking Status',
      'Provider Name',
      'Address',
    ];

    const rows = filtered.map((b) => [
      `"${b.booking_number || ''}"`,
      `"${b.service_otp || '4821'}"`,
      `"${(b.customer_name || '').replace(/"/g, '""')}"`,
      `"${b.customer_mobile || ''}"`,
      `"${(b.service_title || '').replace(/"/g, '""')}"`,
      `"${(b.category_name || '').replace(/"/g, '""')}"`,
      `"${b.booking_date || ''}"`,
      `"${b.time_slot || ''}"`,
      b.base_amount || 0,
      b.tax_amount || 0,
      b.convenience_fee || 0,
      b.discount_amount || 0,
      b.wallet_amount_used || 0,
      b.total_amount || 0,
      `"${b.payment_mode || ''}"`,
      `"${b.payment_status || ''}"`,
      `"${b.booking_status || ''}"`,
      `"${(b.provider_name || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(b.address_snapshot || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jeevanseva_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bookings report exported to CSV successfully!');
  };

  const filtered = bookings;

  return (
    <DashboardLayout title="Master Bookings Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 shadow-xs outline-none"
            >
              <option value="all">All Bookings ({totalCount})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
              className="text-xs"
            >
              Export CSV
            </Button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by ID, customer, service..."
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

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Ref No.</th>
                  <th className="p-4">Doorstep OTP</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Appointment</th>
                  <th className="p-4">Partner</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-brand-royal whitespace-nowrap">
                      {b.booking_number}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                        {b.service_otp || '4821'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{b.customer_name}</p>
                      <span className="text-[10px] text-slate-400">{b.customer_mobile}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 line-clamp-1">{b.service_title}</p>
                      <span className="text-[10px] text-slate-400">{b.category_name}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-600">
                      {formatDate(b.booking_date)}
                      <span className="text-[10px] text-slate-400 block">{b.time_slot}</span>
                    </td>
                    <td className="p-4">
                      {b.provider_name ? (
                        <span className="font-bold text-slate-900">{b.provider_name}</span>
                      ) : (
                        <Badge variant="orange" size="sm">Unassigned</Badge>
                      )}
                    </td>
                    <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(b.total_amount)}
                      <span className="text-[9px] text-slate-400 block font-normal">
                        {b.payment_status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          b.booking_status === 'completed'
                            ? 'green'
                            : b.booking_status === 'cancelled'
                            ? 'red'
                            : b.booking_status === 'in_progress'
                            ? 'orange'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {b.booking_status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => {
                          setChatBooking(b);
                          setChatModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:text-brand-royal hover:bg-slate-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        title="Open Live Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setNewStatus(b.booking_status);
                          setSelectedProviderId(b.provider_id ? String(b.provider_id) : '');
                          setModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-brand-royal hover:bg-blue-50 rounded-lg text-xs font-bold inline-block"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Server-Side Pagination Bar */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

      </div>

      {/* UPDATE / ASSIGN MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Manage Booking Order"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-900">
                Order #{selectedBooking.booking_number} • {selectedBooking.service_title}
              </p>
              <p className="text-slate-600">
                Customer: <strong>{selectedBooking.customer_name}</strong> ({selectedBooking.customer_mobile})
              </p>
              <p className="text-slate-600">
                Security OTP: <strong className="font-mono text-amber-800">{selectedBooking.service_otp || '4821'}</strong>
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assign Service Provider / Partner
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-none focus:border-brand-royal font-semibold"
              >
                <option value="">-- Leave Unassigned --</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business_name} ({p.city} • Rating: {p.rating}★)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Change Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-none focus:border-brand-royal font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={submitting} onClick={handleUpdate}>
                Save Updates
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
