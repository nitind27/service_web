'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function UserWalletPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Top up modal
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('500');
  const [submittingTopup, setSubmittingTopup] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/user/wallet');
      const data = await res.json();
      if (data.success) {
        setBalance(parseFloat(data.data.balance || 0));
        setTransactions(data.data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopupSubmit = async (e) => {
    if (e) e.preventDefault();
    const amountVal = parseFloat(topupAmount);
    if (isNaN(amountVal) || amountVal < 100 || amountVal > 20000) {
      toast.error('Please enter a valid top-up amount between ₹100 and ₹20,000');
      return;
    }

    setSubmittingTopup(true);
    try {
      const res = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountVal }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || '₹' + amountVal + ' added to your wallet!');
        setTopupModalOpen(false);
        fetchWallet();
      } else {
        toast.error(data.message || 'Top-up failed');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setSubmittingTopup(false);
    }
  };

  return (
    <DashboardLayout title="My JeevanSeva Wallet">
      <div className="max-w-4xl space-y-6">
        
        {/* Balance Card */}
        <Card className="p-6 sm:p-8 border-slate-200 bg-gradient-to-tr from-brand-royal via-blue-900 to-slate-900 text-white rounded-3xl shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" /> Available Wallet Balance
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">{formatCurrency(balance)}</h2>
            <p className="text-xs text-blue-200">
              1-click instant checkout on 23+ life services &amp; immediate booking cancellation refunds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="accent"
              size="lg"
              icon={Plus}
              onClick={() => {
                setTopupAmount('500');
                setTopupModalOpen(true);
              }}
              className="whitespace-nowrap shadow-md"
            >
              Add Money
            </Button>
          </div>
        </Card>

        {/* Benefits bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-900">⚡ Zero-Delay Checkout</p>
            <p className="text-[11px] text-slate-500">Skip bank OTPs & payment gateway redirections when booking services.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-900">💸 Instant Auto-Refunds</p>
            <p className="text-[11px] text-slate-500">Cancelled bookings credited back to your wallet instantly within 5 seconds.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-900">🛡️ 100% Safe &amp; Protected</p>
            <p className="text-[11px] text-slate-500">RBI compliant security with end-to-end audit ledger tracking.</p>
          </div>
        </div>

        {/* Transactions History */}
        <Card className="p-6 border-slate-200 shadow-soft bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Wallet Activity History</h3>
            <button
              onClick={fetchWallet}
              className="text-xs text-brand-royal font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <p className="text-slate-400 italic py-6 text-center">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Wallet className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold">No wallet transactions recorded yet.</p>
                <p className="text-slate-400 text-xs">Top up money to enjoy 1-click booking checkout.</p>
              </div>
            ) : (
              transactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                          isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(tx.created_at)} • Balance after: {formatCurrency(tx.balance_after)}
                        </span>
                      </div>
                    </div>
                    <span className={`font-black text-sm whitespace-nowrap ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>

      </div>

      {/* TOP UP MODAL */}
      <Modal
        isOpen={topupModalOpen}
        onClose={() => setTopupModalOpen(false)}
        title="Top Up Wallet Balance"
        size="sm"
      >
        <form onSubmit={handleTopupSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Select or enter an amount to add to your JeevanSeva Wallet via UPI / Card:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {['200', '500', '1000'].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTopupAmount(amt)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  topupAmount === amt
                    ? 'border-brand-royal bg-blue-50 text-brand-royal ring-1 ring-brand-royal'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <Input
            label="Custom Amount (₹)"
            type="number"
            min={100}
            max={20000}
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            required
            helper="Enter amount between ₹100 and ₹20,000"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setTopupModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" type="submit" loading={submittingTopup}>
              Add {formatCurrency(parseFloat(topupAmount) || 0)}
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
