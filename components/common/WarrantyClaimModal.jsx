'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  KeyRound,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export default function WarrantyClaimModal({ isOpen, onClose, booking, onSuccess }) {
  const toast = useToast();
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  if (!booking) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!issueDescription.trim() || issueDescription.trim().length < 5) {
      toast.error('Please describe what issue occurred after service completion.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/warranty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_description: issueDescription,
          preferred_date: preferredDate || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClaimResult(data.data);
        toast.success('30-Day Guarantee claim approved! ₹0 follow-up booked.');
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || 'Could not process warranty claim');
      }
    } catch (err) {
      toast.error('An error occurred. Please contact customer care.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setClaimResult(null);
    setIssueDescription('');
    setPreferredDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="md">
      {claimResult ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              🛡️ Zero-Cost Rework Scheduled
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Jeevan Suraksha Guarantee Approved
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              New Inspection Booking #{claimResult.bookingNumber}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Original Service:</span>
              <span className="font-bold text-slate-800">{claimResult.serviceTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Follow-Up Date:</span>
              <span className="font-bold text-slate-800">{claimResult.bookingDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Charge:</span>
              <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                ₹0 (100% Free Under Guarantee)
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium">New Doorstep OTP:</span>
              <span className="font-mono text-base font-black tracking-widest text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {claimResult.serviceOtp}
              </span>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={handleClose}>
            Done, View My Bookings
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 pr-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                30-Day Free Rework Guarantee
              </h3>
              <p className="text-xs text-slate-500">
                Jeevan Suraksha Protection • 100% Free Doorstep Re-Inspection
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Complete Peace of Mind
            </p>
            <p className="text-emerald-900/80">
              If the completed work for <strong>{booking.service_title}</strong> (#{booking.booking_number}) is unsatisfactory or recurs within 30 days, we dispatch a senior supervisor at ₹0 cost.
            </p>
          </div>

          <form onSubmit={handleClaim} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Describe the Issue or Problem Faced *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Water started leaking again after 5 days, or cooling is insufficient..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:bg-white focus:border-brand-royal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Inspection Date (Optional)
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-brand-royal"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                className="py-3 font-black rounded-xl"
              >
                Claim Free Rework Inspection
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
