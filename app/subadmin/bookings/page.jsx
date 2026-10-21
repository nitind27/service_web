'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubAdminBookingsPage() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Assign modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings?limit=50');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleAssignProvider = async () => {
    if (!selectedBooking || !selectedProviderId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: parseInt(selectedProviderId, 10),
          status: 'assigned',
          notes: 'Provider manually assigned by Operations Manager',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Service partner assigned to booking successfully!');
        setAssignModalOpen(false);
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to assign provider');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.booking_status !== statusFilter) return false;
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
    <DashboardLayout title="Operations: Manage Bookings">
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 shadow-xs outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by ID, customer, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 pl-8 outline-none focus:border-brand-royal"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          {loading ? (
            <div className="text-center py-16 text-xs text-slate-500 font-semibold">
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service Details</th>
                    <th className="p-4">Appointment</th>
                    <th className="p-4">Assigned Partner</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 font-bold text-brand-royal whitespace-nowrap">
                        {b.booking_number}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{b.customer_name}</p>
                        <p className="text-[10px] text-slate-400">{b.customer_mobile}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 line-clamp-1">{b.service_title}</p>
                        {b.variant_title && <span className="text-[10px] text-slate-500">{b.variant_title}</span>}
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
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(b.total_amount)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge
                          variant={b.booking_status === 'completed' ? 'green' : b.booking_status === 'cancelled' ? 'red' : 'blue'}
                          size="sm"
                        >
                          {b.booking_status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={UserCheck}
                          onClick={() => {
                            setSelectedBooking(b);
                            if (b.provider_id) setSelectedProviderId(String(b.provider_id));
                            setAssignModalOpen(true);
                          }}
                        >
                          {b.provider_name ? 'Reassign' : 'Assign Partner'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ASSIGN PROVIDER MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Service Provider Partner"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Assign a verified technician to order <strong>{selectedBooking.booking_number}</strong> ({selectedBooking.service_title}).
            </p>

            <Select
              label="Select Verified Partner"
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              options={providers.map((p) => ({
                value: String(p.id),
                label: `${p.business_name} (${p.city}) - ★ ${p.rating}`,
              }))}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" loading={submitting} onClick={handleAssignProvider}>
                Save Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
}
