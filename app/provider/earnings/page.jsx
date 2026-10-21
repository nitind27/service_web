'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  Building2,
  Landmark,
  AlertCircle,
  ArrowDownCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function ProviderEarningsPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [payoutsData, setPayoutsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request Payout Modal
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [reqAmount, setReqAmount] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const fetchAllData = async () => {
    try {
      const [earnRes, payoutRes] = await Promise.all([
        fetch('/api/provider/earnings'),
        fetch('/api/provider/payouts'),
      ]);

      const earnJson = await earnRes.json();
      const payoutJson = await payoutRes.json();

      if (earnJson.success) setData(earnJson.data);
      if (payoutJson.success) {
        setPayoutsData(payoutJson.data);
        if (payoutJson.data.bankDetails) {
          setBankName(payoutJson.data.bankDetails.bankName || 'HDFC Bank');
          setAccountNumber(payoutJson.data.bankDetails.accountNumber || '');
          setIfscCode(payoutJson.data.bankDetails.ifscCode || '');
          setUpiId(payoutJson.data.bankDetails.upiId || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenPayoutModal = () => {
    const withdrawable = payoutsData?.summary?.withdrawable || data?.stats?.netEarnings || 0;
    setReqAmount(String(Math.floor(withdrawable)));
    setPayoutModalOpen(true);
  };

  const handleRequestPayoutSubmit = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(reqAmount);
    if (isNaN(amountVal) || amountVal < 500) {
      toast.error('Minimum withdrawal amount is ₹500');
      return;
    }

    setSubmittingPayout(true);
    try {
      const res = await fetch('/api/provider/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountVal,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          upi_id: upiId,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success(resData.message || 'Payout request submitted successfully!');
        setPayoutModalOpen(false);
        fetchAllData();
      } else {
        toast.error(resData.message || 'Failed to submit payout request');
      }
    } catch (err) {
      toast.error('Connection error. Please try again.');
    } finally {
      setSubmittingPayout(false);
    }
  };

  const withdrawableBal = payoutsData?.summary?.withdrawable ?? (data?.stats?.netEarnings || 0);

  return (
    <DashboardLayout title="Earnings & Bank Payouts">
      <div className="space-y-6 max-w-5xl">
        
        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white space-y-1">
            <span className="text-xs text-slate-500 font-semibold block uppercase">Gross Billings</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {formatCurrency(data?.stats?.grossRevenue || 12500)}
            </span>
            <span className="text-[10px] text-slate-400 block">Total customer billings</span>
          </Card>

          <Card className="p-5 border-slate-200 bg-emerald-50/50 border-emerald-200 space-y-1">
            <span className="text-xs text-emerald-800 font-semibold block uppercase">Net Earnings (85%)</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">
              {formatCurrency(payoutsData?.summary?.totalEarnings || data?.stats?.netEarnings || 10625)}
            </span>
            <span className="text-[10px] text-emerald-600 block">After 15% platform fee</span>
          </Card>

          <Card className="p-5 border-slate-200 bg-blue-50/50 border-blue-200 space-y-1">
            <span className="text-xs text-blue-800 font-semibold block uppercase">Total Settled</span>
            <span className="text-xl sm:text-2xl font-black text-blue-700">
              {formatCurrency(payoutsData?.summary?.paidSum || 3500)}
            </span>
            <span className="text-[10px] text-blue-600 block">Transferred to bank</span>
          </Card>

          <Card className="p-5 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-amber-900 font-bold block uppercase tracking-wide">Withdrawable</span>
              <span className="text-xl sm:text-2xl font-black text-amber-950">
                {formatCurrency(withdrawableBal)}
              </span>
            </div>
            <Button
              variant="accent"
              size="sm"
              disabled={withdrawableBal < 500}
              onClick={handleOpenPayoutModal}
              className="w-full"
            >
              Withdraw to Bank
            </Button>
          </Card>
        </div>

        {/* Payout Requests History */}
        <Card className="p-6 border-slate-200 shadow-soft bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Bank Payout Requests</h3>
              <p className="text-xs text-slate-500">Withdrawals processed automatically into your registered bank or UPI.</p>
            </div>
            <Badge variant="blue">NEFT / IMPS / UPI</Badge>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {payoutsData?.payouts && payoutsData.payouts.length > 0 ? (
              payoutsData.payouts.map((p) => (
                <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">₹{p.amount}</span>
                      <Badge
                        variant={p.status === 'processed' ? 'green' : p.status === 'pending' ? 'orange' : 'red'}
                        size="sm"
                      >
                        {p.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Bank: <strong>{p.bank_name}</strong> • Acc: ••••{p.account_number?.slice(-4) || 'UPI'} • UPI: {p.upi_id || 'N/A'}
                    </p>
                    {p.transaction_reference && (
                      <p className="text-[10px] text-emerald-700 font-mono">
                        Bank UTR / Ref: {p.transaction_reference}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right text-[11px] text-slate-400">
                    <span>Requested: {formatDate(p.created_at)}</span>
                    {p.processed_at && (
                      <span className="block text-emerald-600 font-medium">Settled: {formatDate(p.processed_at)}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic py-4">No bank payout requests yet. Click &quot;Withdraw to Bank&quot; to transfer your earnings.</p>
            )}
          </div>
        </Card>

        {/* Recent Jobs Earning Log */}
        <Card className="p-6 border-slate-200 shadow-soft bg-white space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Recent Completed Jobs Earnings Breakdown</h3>

          <div className="divide-y divide-slate-100 text-xs">
            {data?.recentPayouts && data.recentPayouts.length > 0 ? (
              data.recentPayouts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{p.service_title}</span>
                    <span className="text-[10px] text-slate-400">Order: {p.booking_number} • {formatDate(p.booking_date)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">+{formatCurrency(p.total_amount * 0.85)}</span>
                    <span className="text-[10px] text-slate-400">Customer Bill: {formatCurrency(p.total_amount)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic py-4">No completed job payouts recorded yet.</p>
            )}
          </div>
        </Card>

      </div>

      {/* REQUEST PAYOUT MODAL */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Bank Transfer Payout"
        size="md"
      >
        <form onSubmit={handleRequestPayoutSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-brand-royal flex-shrink-0" />
            <span>Funds will be transferred via IMPS/NEFT within 24-48 business hours.</span>
          </div>

          <Input
            label="Withdrawal Amount (₹)"
            type="number"
            min={500}
            max={Math.floor(withdrawableBal)}
            value={reqAmount}
            onChange={(e) => setReqAmount(e.target.value)}
            required
            helper={`Available withdrawable: ₹${withdrawableBal}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Bank Name"
              placeholder="e.g. HDFC Bank, SBI, ICICI"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
            <Input
              label="Bank Account Number"
              placeholder="e.g. 5010029381920"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="IFSC Code"
              placeholder="e.g. HDFC0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              required
            />
            <Input
              label="UPI ID (Optional for fast payout)"
              placeholder="e.g. partner@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" type="submit" loading={submittingPayout}>
              Confirm Withdrawal
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
