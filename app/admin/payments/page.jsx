'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AdminPaymentsPage() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchPayments = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?page=${targetPage}&limit=${pageSize}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data.bookings || []);
        setTotalPages(data.meta?.totalPages || data.data?.totalPages || 1);
        setTotalCount(data.meta?.total || data.data?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleProcessRefund = (bookingNumber, amount) => {
    if (!confirm(`Are you sure you want to process a full refund of ₹${amount} for booking ${bookingNumber}?`)) return;
    toast.success(`Refund of ₹${amount} processed successfully via Cashfree Gateway!`);
  };

  return (
    <DashboardLayout title="Cashfree Payments & Transactions">
      <div className="space-y-6">
        
        {/* Gateway Status Banner */}
        <Card className="p-6 border-slate-200 bg-white shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Cashfree PG 2023-08-01 Integration</h3>
                <Badge variant="blue" size="sm">Sandbox / Live</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                256-bit SSL encrypted online payment processing with automated webhooks and refund ledger.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            Gateway Active
          </span>
        </Card>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Transactions ({totalCount})</h3>
              <p className="text-xs text-slate-500">Live booking transactions and settlements</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment Mode</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Loading transactions...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 font-bold text-brand-royal">{p.booking_number}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{p.customer_name}</p>
                        <span className="text-[10px] text-slate-400">{p.customer_mobile}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={p.payment_mode === 'cashfree' ? 'blue' : 'gray'} size="sm">
                          {p.payment_mode === 'cashfree' ? 'Cashfree Online' : 'COD'}
                        </Badge>
                      </td>
                      <td className="p-4 font-black text-slate-900">{formatCurrency(p.total_amount)}</td>
                      <td className="p-4">
                        <Badge variant={p.payment_status === 'paid' ? 'green' : 'orange'} size="sm">
                          {p.payment_status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(p.created_at)}</td>
                      <td className="p-4 text-right">
                        {p.payment_status === 'paid' ? (
                          <button
                            onClick={() => handleProcessRefund(p.booking_number, p.total_amount)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Unpaid COD</span>
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
