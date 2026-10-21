'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  Building,
  Wallet,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import PincodeChecker from '@/components/common/PincodeChecker';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, validateIndianMobile, validateEmail } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

function BookingContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [service, setService] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking fields
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMode, setPaymentMode] = useState('cashfree'); // 'cashfree' or 'cod'
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      display: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerMobile) setCustomerMobile(user.mobile || '');
      if (user.city) setCity(user.city);

      // Fetch customer wallet balance
      fetch('/api/user/wallet')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setWalletBalance(parseFloat(d.data.balance || 0));
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].iso);
    }
  }, []);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/services/${slug}`);
        const data = await res.json();
        if (data.success && data.data.service) {
          setService(data.data.service);
          setVariants(data.data.variants || []);

          const qVar = searchParams.get('variant');
          if (qVar) {
            setSelectedVariantId(parseInt(qVar, 10));
          } else if (data.data.variants && data.data.variants.length > 0) {
            setSelectedVariantId(data.data.variants[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [slug, searchParams]);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const basePrice = selectedVariant
    ? parseFloat(selectedVariant.discount_price || selectedVariant.price)
    : service
    ? parseFloat(service.discount_price || service.base_price)
    : 0;

  const gstTax = Math.round(basePrice * 0.05);
  const convenienceFee = 49;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const initialTotal = Math.max(0, Math.round(basePrice + gstTax + convenienceFee - discountAmount));
  const walletDeduction = useWallet ? Math.min(walletBalance, initialTotal) : 0;
  const totalAmount = Math.max(0, Math.round((initialTotal - walletDeduction) * 100) / 100);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), amount: basePrice }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
        toast.success(data.message || 'Coupon applied successfully!');
      } else {
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

  const handleSubmitBooking = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter customer full name');
      return;
    }
    if (!customerMobile.trim() || !validateIndianMobile(customerMobile)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!addressLine.trim() || !pincode.trim()) {
      toast.error('Please enter complete address line and 6-digit pincode');
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select booking date and arrival time window');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddressSnapshot = `${addressLine.trim()}, Landmark: ${landmark.trim() || 'N/A'}, City: ${city}, PIN: ${pincode.trim()}`;

      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          variant_id: selectedVariantId,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim() || 'customer@jeevanseva.in',
          customer_mobile: customerMobile.trim(),
          address_snapshot: fullAddressSnapshot,
          booking_date: selectedDate,
          time_slot: selectedTimeSlot,
          special_instructions: specialInstructions,
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
          use_wallet: useWallet,
          payment_mode: totalAmount === 0 ? 'wallet' : paymentMode,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingData.success) {
        toast.error(bookingData.message || 'Failed to create booking');
        setSubmitting(false);
        return;
      }

      const bookingNumber = bookingData.data.bookingNumber;

      if (totalAmount === 0 || bookingData.data.paymentMode === 'wallet') {
        toast.success('Paid via JeevanSeva Wallet balance! Booking confirmed.');
        router.push(`/booking/confirmation/${bookingNumber}`);
        return;
      }

      if (paymentMode === 'cashfree') {
        const payRes = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: bookingNumber }),
        });
        const payData = await payRes.json();

        if (payData.success) {
          if (payData.data.isSimulated) {
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: payData.data.orderId, bookingNumber }),
            });
            toast.success('Payment simulated successfully! Booking confirmed.');
            router.push(`/booking/confirmation/${bookingNumber}`);
            return;
          }
          router.push(`/booking/confirmation/${bookingNumber}?order_id=${payData.data.orderId}`);
          return;
        }
      }

      toast.success('Booking placed successfully! Pay after service completion.');
      router.push(`/booking/confirmation/${bookingNumber}`);
    } catch (err) {
      console.error('Booking checkout error:', err);
      toast.error('An error occurred during booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 font-semibold">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link href={`/services/${service.slug}`} className="text-xs font-bold text-brand-royal hover:underline flex items-center gap-1 mb-2">
          ← Back to service details
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Complete Your Doorstep Service Booking
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review package variants, select your arrival time, address, and secure payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {variants.length > 0 && (
            <Card className="p-6 border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Package Variant</span>
              </div>

              {/* Wallet Balance Payment Option */}
            {user && walletBalance > 0 && (
              <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">JeevanSeva Wallet Balance</p>
                    <p className="text-[11px] text-amber-800">
                      Available Balance: <strong>{formatCurrency(walletBalance)}</strong>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 shadow-xs">
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Apply Balance</span>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-royal bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{v.title}</h4>
                        <span className="text-xs font-black text-slate-900">
                          {formatCurrency(v.discount_price || v.price)}
                        </span>
                      </div>
                      {v.description && (
                        <p className="text-[11px] text-slate-500 mt-1">{v.description}</p>
                      )}
                      <span className="text-[10px] text-slate-400 block mt-2">
                        ⏱️ Duration: ~{v.duration_minutes} mins
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Select Date & Arrival Window</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Service Date
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-royal text-white border-brand-royal shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-royal'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-80">{item.day}</span>
                      <span className="text-base font-black block leading-none my-1">{item.date}</span>
                      <span className="text-[10px] block opacity-80">{item.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-50 text-brand-royal border-brand-royal ring-1 ring-brand-royal'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Doorstep Address & Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Amitabh Roy"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email Address"
              placeholder="customer@gmail.com"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />

            <Input
              label="House / Flat / Street Address"
              placeholder="e.g. Flat 402, Royal Palms, Sector 62"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Landmark (Optional)"
                placeholder="Near Metro Station"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                label="Pincode"
                placeholder="201301"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <PincodeChecker
                initialPincode={pincode}
                onVerified={(res) => {
                  if (res?.city && res.city !== 'Nationwide Network') setCity(res.city);
                  if (res?.pincode) setPincode(res.pincode);
                }}
                compact={true}
              />
            </div>

            <Textarea
              label="Special Instructions (Optional)"
              placeholder="e.g. Please call before arrival..."
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </Card>

          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Choose Payment Method</span>
            </div>

            {/* Wallet Balance Payment Option */}
            {user && walletBalance > 0 && (
              <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">JeevanSeva Wallet Balance</p>
                    <p className="text-[11px] text-amber-800">
                      Available Balance: <strong>{formatCurrency(walletBalance)}</strong>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 shadow-xs">
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Apply Balance</span>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMode === 'cashfree'
                    ? 'border-brand-royal bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="cashfree"
                  checked={paymentMode === 'cashfree'}
                  onChange={() => setPaymentMode('cashfree')}
                  className="mt-1 accent-brand-royal"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    Pay Online via Cashfree
                    <Badge variant="blue" size="sm">Recommended</Badge>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    UPI, Cards, Net Banking. 256-bit SSL secured with instant refund guarantee.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMode === 'cod'
                    ? 'border-brand-royal bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="cod"
                  checked={paymentMode === 'cod'}
                  onChange={() => setPaymentMode('cod')}
                  className="mt-1 accent-brand-royal"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pay After Service (Cash on Delivery)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay to the verified technician directly after service completion.
                  </p>
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* Right sticky summary */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <Card className="p-6 border-slate-200 shadow-elevated space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-500" /> Price Summary
            </h3>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-800">{service.title}</h4>
              {selectedVariant && (
                <p className="text-slate-500 font-medium">Selected: {selectedVariant.title}</p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div>
                    <span className="font-bold uppercase tracking-wider">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-emerald-700">₹{appliedCoupon.discount} discount saved!</p>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-xs font-bold text-rose-600 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. FESTIVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs uppercase font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-brand-royal"
                  />
                  <Button type="submit" variant="outline" size="sm" loading={couponLoading}>
                    Apply
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Service Price:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-semibold text-slate-800">{formatCurrency(gstTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience & Safety Fee:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(convenienceFee)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {useWallet && walletDeduction > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Wallet Balance Used:</span>
                  <span>-{formatCurrency(walletDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-black text-slate-900">
                <span>{useWallet && walletDeduction > 0 ? 'Net Payable Amount:' : 'Total Amount:'}</span>
                <span className="text-brand-royal">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              loading={submitting}
              onClick={handleSubmitBooking}
              className="w-full text-base py-4 font-bold shadow-md"
            >
              {totalAmount === 0
                ? 'Confirm Booking with Wallet Balance'
                : paymentMode === 'cashfree'
                ? 'Proceed to Pay with Cashfree'
                : 'Confirm Cash on Delivery Booking'}
            </Button>

            <div className="text-[11px] text-slate-400 space-y-1 text-center pt-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure Checkout with 30-Day Guarantee
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500 font-semibold">Loading checkout...</div>}>
      <BookingContent />
    </Suspense>
  );
}
