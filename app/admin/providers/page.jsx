'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Star, Search, Edit3, ShieldCheck, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';

export default function AdminProvidersPage() {
  const toast = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Commission modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [commissionRate, setCommissionRate] = useState('15');
  const [saving, setSaving] = useState(false);

  const fetchProviders = useCallback(async (targetPage = page, query = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(pageSize),
      });
      if (query && query.trim()) params.append('q', query.trim());

      const res = await fetch(`/api/admin/providers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.data.providers || []);
        setTotalPages(data.meta?.totalPages || data.data?.totalPages || 1);
        setTotalCount(data.meta?.total || data.data?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, pageSize]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Partner status changed to ${status.toUpperCase()}`);
        fetchProviders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleSaveCommission = async () => {
    if (!selectedProvider) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProvider.id, commission_rate: parseFloat(commissionRate) }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Commission rate updated successfully!');
        setEditModalOpen(false);
        fetchProviders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Service Partner Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Registered Service Partners ({totalCount})</h2>
            <p className="text-xs text-slate-500">Monitor partner ratings, completed jobs, and commission percentages.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search partner or mobile..."
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
                  <th className="p-4">Partner Business</th>
                  <th className="p-4">Owner Contact</th>
                  <th className="p-4">City & Area</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Loading partners...
                    </td>
                  </tr>
                ) : providers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No service partners found.
                    </td>
                  </tr>
                ) : (
                  providers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{p.business_name}</p>
                        <span className="text-[10px] text-slate-400">{p.experience_years} Yrs Exp • GST: {p.gst_number || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{p.owner_name}</p>
                        <span className="text-[10px] text-slate-400">{p.owner_mobile}</span>
                      </td>
                      <td className="p-4 text-slate-700">
                        {p.city}
                        <span className="text-[10px] text-slate-400 block">{p.service_area}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ★ {p.rating} <span className="text-[10px] text-slate-400 font-normal">({p.total_reviews})</span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {p.commission_rate || 15}%
                      </td>
                      <td className="p-4">
                        <Badge variant={p.status === 'approved' ? 'green' : p.status === 'pending' ? 'orange' : 'red'}>
                          {p.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          onClick={() => {
                            setSelectedProvider(p);
                            setCommissionRate(String(p.commission_rate || 15));
                            setEditModalOpen(true);
                          }}
                        >
                          Rate
                        </Button>
                        {p.status === 'approved' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50"
                            onClick={() => handleUpdateStatus(p.id, 'suspended')}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdateStatus(p.id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
          />
        </div>

      </div>

      {/* EDIT COMMISSION MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Partner Commission Rate"
        size="sm"
      >
        {selectedProvider && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Set marketplace platform commission percentage for <strong>{selectedProvider.business_name}</strong>.
            </p>

            <Input
              label="Commission Percentage (%)"
              type="number"
              placeholder="15"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" loading={saving} onClick={handleSaveCommission}>
                Update Commission
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
}
