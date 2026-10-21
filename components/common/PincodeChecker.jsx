'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function PincodeChecker({ initialPincode = '', onVerified, compact = false }) {
  const [pincode, setPincode] = useState(initialPincode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkPincode = async (e) => {
    if (e) e.preventDefault();
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/pincode/check?pincode=${pincode}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        if (onVerified) onVerified(data.data);
      } else {
        setError(data.message || 'Unable to verify pincode');
        setResult(null);
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl ${compact ? 'p-3' : 'p-4 border border-slate-200 shadow-sm'}`}>
      <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold text-sm">
        <MapPin className="w-4 h-4 text-brand-royal" />
        <span>Check Doorstep Availability in Your Area</span>
      </div>

      <form onSubmit={checkPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode (e.g. 110001)"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal focus:border-brand-royal"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-royal hover:bg-brand-navy rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Serviceable in {result.city}, {result.state}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Fast Technician Arrival: <strong>{result.sla}</strong></span>
          </div>
          <p className="text-emerald-600 text-[11px] pt-0.5">{result.message}</p>
        </div>
      )}
    </div>
  );
}
