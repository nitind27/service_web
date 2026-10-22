'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, CheckCircle, XCircle, Search, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';

export default function SubAdminProvidersPage() {
  const toast = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

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
        toast.success(`Partner status updated to ${status.toUpperCase()}`);
        fetchProviders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <DashboardLayout title="Partner Approvals & Verification">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Partner Verification Queue ({totalCount})</h2>
            <p className="text-xs text-slate-500">Review business applications, credentials, and activate partners.</p>
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
                  <th className="p-4">Business / Partner</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">City & Area</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Loading partners...
                    </td>
                  </tr>
                ) : providers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No partners found.
                    </td>
                  </tr>
                ) : (
                  providers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{p.business_name}</p>
                        <span className="text-[10px] text-slate-400">Owner: {p.owner_name}</span>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 font-semibold">{p.owner_mobile}</p>
                        <span className="text-[10px] text-slate-400">{p.owner_email}</span>
                      </td>
                      <td className="p-4 text-slate-700">
                        {p.city}
                        <span className="text-[10px] text-slate-400 block">{p.service_area}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {p.experience_years} Years
                      </td>
                      <td className="p-4">
                        <Badge variant={p.status === 'approved' ? 'green' : p.status === 'pending' ? 'orange' : 'red'}>
                          {p.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        {p.status !== 'approved' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdateStatus(p.id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                        {p.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50"
                            onClick={() => handleUpdateStatus(p.id, 'suspended')}
                          >
                            Suspend
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
    </DashboardLayout>
  );
}
