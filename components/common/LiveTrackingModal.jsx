'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  User,
  Star,
  Car,
  AlertCircle,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function LiveTrackingModal({ isOpen, onClose, booking, onOpenChat }) {
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 3 ? prev - 1 : 3));
    }, 15000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!booking) return null;

  const isCompleted = booking.booking_status === 'completed';
  const isInProgress = booking.booking_status === 'in_progress';
  const isAssigned = ['assigned', 'in_progress'].includes(booking.booking_status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-royal flex items-center justify-center">
              <Navigation className="w-5 h-5 text-brand-royal animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Doorstep Live Route Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Booking #{booking.booking_number} • {booking.service_title}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-brand-royal border border-blue-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'En Route'}
          </span>
        </div>

        {/* Simulated GPS Route Visualization */}
        <div className="relative h-48 sm:h-56 rounded-2xl bg-slate-900 overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
          {/* Subtle grid map pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

          {/* Simulated Route Line */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 60 140 Q 180 40 320 120 T 480 80"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Technician Marker */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 rounded-full bg-brand-royal text-white flex items-center justify-center shadow-lg ring-4 ring-blue-400/40">
              <Car className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-[10px] font-bold text-white rounded shadow-sm border border-slate-700">
              Technician (Rahul V.)
            </span>
          </div>

          {/* Destination Customer Marker */}
          <div className="absolute right-16 top-1/3 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-lg ring-4 ring-amber-400/40">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-[10px] font-bold text-amber-300 rounded shadow-sm border border-slate-700">
              Your Home
            </span>
          </div>

          {/* Floating ETA Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-accent-500" />
            <span className="text-slate-600 font-medium">Estimated Arrival:</span>
            <span className="font-black text-brand-royal text-sm">~{etaMinutes} Mins</span>
          </div>
        </div>

        {/* Security OTP Card */}
        {booking.service_otp && !isCompleted && (
          <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-950">
                  Doorstep Start Security OTP
                </p>
                <p className="text-[11px] text-amber-800">
                  Share this OTP with technician only upon arrival at your doorstep.
                </p>
              </div>
            </div>
            <span className="font-mono text-xl font-black tracking-widest text-slate-900 bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
              {booking.service_otp}
            </span>
          </div>
        )}

        {/* Technician Profile Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-brand-royal flex items-center justify-center font-bold text-base flex-shrink-0 border border-blue-200">
              <User className="w-6 h-6 text-brand-royal" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">
                  {booking.provider_name || 'Rahul Verma'}
                </h4>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Police Verified
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.92 (380+ jobs)
                </span>
                <span>•</span>
                <span>{booking.service_title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${booking.provider_mobile || '+919876543210'}`}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-royal text-slate-700 hover:text-brand-royal text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-accent-500" /> Call
            </a>

            {onOpenChat && (
              <Button
                variant="primary"
                size="sm"
                icon={MessageSquare}
                onClick={() => {
                  onClose();
                  onOpenChat(booking);
                }}
              >
                Chat
              </Button>
            )}
          </div>
        </div>

        {/* 4-Step Progress Timeline */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Doorstep Delivery Timeline
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
              </div>
              <p className="text-[10px] text-slate-500">Order recorded in system</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
              </div>
              <p className="text-[10px] text-slate-500">Verified technician allocated</p>
            </div>

            <div className={`p-3 rounded-xl border ${
              isInProgress || isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-blue-50 border-blue-200 text-brand-royal'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Car className="w-3.5 h-3.5 animate-pulse" /> En Route
              </div>
              <p className="text-[10px] text-slate-500">Technician on vehicle</p>
            </div>

            <div className={`p-3 rounded-xl border ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Guarantee
              </div>
              <p className="text-[10px] text-slate-500">Free rework protection</p>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}
