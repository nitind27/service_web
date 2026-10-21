'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('20');
  const [minBookingAmount, setMinBookingAmount] = useState('500');
  const [maxDiscount, setMaxDiscount] = useState('500');
  const [usageLimit, setUsageLimit] = useState('1000');
  const [validUntil, setValidUntil] = useState('2027-12-31');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !discountValue) {
      toast.error('Code, title, and discount value required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          title: title.trim(),
          discount_type: discountType,
          discount_value: parseFloat(discountValue),
          min_booking_amount: parseFloat(minBookingAmount || 0),
          max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
          usage_limit: parseInt(usageLimit || 1000, 10),
          valid_until: validUntil,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon code ${code.toUpperCase()} created!`);
        setModalOpen(false);
        setCode('');
        setTitle('');
        fetchCoupons();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <DashboardLayout title="Coupons & Promotional Offers">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Promo Codes ({coupons.length})</h2>
            <p className="text-xs text-slate-500">Create discount coupons to drive customer acquisition.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Create Coupon
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((cp) => (
            <Card key={cp.id} className="p-5 border-slate-200 shadow-soft space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-brand-royal uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {cp.code}
                  </span>
                  <Badge variant={cp.status === 'active' ? 'green' : 'gray'} size="sm">
                    {cp.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-xs">{cp.title}</h3>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>
                    Discount: <strong>{cp.discount_type === 'percentage' ? `${cp.discount_value}%` : formatCurrency(cp.discount_value)}</strong>
                    {cp.max_discount && ` (Max: ${formatCurrency(cp.max_discount)})`}
                  </p>
                  <p>Min Booking: <strong>{formatCurrency(cp.min_booking_amount)}</strong></p>
                  <p>Times Used: <strong>{cp.times_used}</strong> / {cp.usage_limit}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Valid until {cp.valid_until}</span>
                <button
                  onClick={() => handleDeleteCoupon(cp.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>

      </div>

      {/* CREATE COUPON MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Discount Coupon"
        size="md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Coupon Code"
              placeholder="e.g. DIWALI30"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
            <Input
              label="Offer Title"
              placeholder="e.g. Festive Special 30% Off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              options={[
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Amount (₹)' },
              ]}
              required
            />
            <Input
              label="Value"
              type="number"
              placeholder="20"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
            <Input
              label="Max Cap (₹)"
              type="number"
              placeholder="500"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Min Booking Amount (₹)"
              type="number"
              placeholder="500"
              value={minBookingAmount}
              onChange={(e) => setMinBookingAmount(e.target.value)}
            />
            <Input
              label="Valid Until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
