'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Ambulance,
  HeartHandshake,
  Clock,
  PhoneCall,
  CheckCircle2,
  X,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function EmergencySosModal({ isOpen, onClose }) {
  const toast = useToast();
  const [serviceType, setServiceType] = useState('ambulance'); // 'ambulance' | 'last_rites'
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!address) {
      toast.error('Please provide doorstep address for dispatch');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/emergency/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          customer_name: name || 'Emergency Request',
          customer_mobile: mobile,
          address_snapshot: address,
          city,
          pincode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchResult(data.data);
        toast.success('Emergency dispatched! Vehicle on the way.');
      } else {
        toast.error(data.message || 'Dispatch failed');
      }
    } catch (err) {
      toast.error('Failed to dispatch. Please call hotline directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDispatchResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="" size="md">
      {dispatchResult ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              🚨 Priority 15-Minute Dispatch Active
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Assistance is En Route to Your Location
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Order #{dispatchResult.bookingNumber} • {dispatchResult.serviceTitle}
            </p>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Estimated Arrival Time:</span>
              <span className="font-black text-red-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 15 - 20 Minutes
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-red-100 pt-2">
              <span className="text-slate-600 font-medium">Doorstep Security OTP:</span>
              <span className="font-mono text-base font-black tracking-widest text-slate-900 bg-white px-2.5 py-0.5 rounded border border-red-200">
                {dispatchResult.serviceOtp}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-red-100 pt-2">
              <span className="text-slate-600 font-medium">24x7 Direct Hotline:</span>
              <a
                href={`tel:${dispatchResult.helpline}`}
                className="font-bold text-red-700 hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" /> {dispatchResult.helpline}
              </a>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={handleReset}>
            OK, Close and Track
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                24x7 Emergency SOS Rapid Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Immediate response within 15-20 minutes across 28+ States
              </p>
            </div>
          </div>

          {/* Service Selector Chips */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setServiceType('ambulance')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-2 ${
                serviceType === 'ambulance'
                  ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Ambulance className={`w-5 h-5 ${serviceType === 'ambulance' ? 'text-red-600' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs font-black">Ambulance Dispatch</p>
                <p className="text-[10px] text-slate-500 leading-tight">ICU, Oxygen & Paramedic</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setServiceType('last_rites')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-2 ${
                serviceType === 'last_rites'
                  ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <HeartHandshake className={`w-5 h-5 ${serviceType === 'last_rites' ? 'text-red-600' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs font-black">Last Rites Assistance</p>
                <p className="text-[10px] text-slate-500 leading-tight">Hearse, Samagri & Pandit</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleDispatch} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doorstep Address *</label>
              <input
                type="text"
                placeholder="Complete address (House, Building, Landmark)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile (+91) *</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="danger"
                fullWidth
                loading={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl shadow-md"
              >
                🚨 1-Tap Instant Dispatch Now
              </Button>
            </div>
          </form>

          <div className="text-center border-t border-slate-100 pt-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Prefer to talk? Call 24x7 Direct Hotline: +91 98765 43210
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
