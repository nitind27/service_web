'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

export default function SmartServiceWizard() {
  const [problemDescription, setProblemDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  const quickSymptoms = [
    { label: '❄️ AC blowing warm air', text: 'My AC is running but blowing warm air and making a vibrating noise' },
    { label: '💧 Water leaking under sink', text: 'Water is dripping from the kitchen sink pipe and flooding the cabinet' },
    { label: '⚡ Sparks in switchboard', text: 'Switchboard is sparking and main MCB trips when I turn on geyser' },
    { label: '🪳 Termites in wooden bed', text: 'Found wood powder and termites inside bedroom wooden wardrobe' },
    { label: '🩺 Elderly nurse at home', text: 'Need a certified attendant for elderly mother post hip surgery' },
    { label: '🕊️ Urgent last rites hearse', text: 'Need hearse van, antim sanskar samagri, and pandit assistance' },
  ];

  const handleDiagnose = async (textToDiagnose) => {
    const queryText = textToDiagnose || problemDescription;
    if (!queryText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/assistant/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_description: queryText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDiagnosis(data.data);
      } else {
        setError(data.message || 'Unable to diagnose. Please browse categories.');
      }
    } catch (err) {
      setError('Connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-elevated border border-blue-800/40">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Jeevan Mitra • AI Smart Problem Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Not Sure What Service You Need? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-amber-200 to-orange-400">
              Describe the Problem — AI Finds the Right Solution.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Tell us what happened in plain Hindi or English. Our diagnostic engine matches you with vetted technicians, upfront costs, and immediate safety steps.
          </p>
        </div>

        {/* Input Bar */}
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-3 px-3 py-2 flex-1">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="e.g. AC leaking water, geyser switch burnt, elderly patient care..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDiagnose()}
              className="w-full text-sm font-medium text-white placeholder-slate-400 outline-none bg-transparent"
            />
          </div>
          <Button
            variant="accent"
            size="md"
            loading={loading}
            onClick={() => handleDiagnose()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black shadow-md flex-shrink-0 rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Diagnose Issue
          </Button>
        </div>

        {/* Quick Symptom Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold">Common issues:</span>
          {quickSymptoms.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProblemDescription(chip.text);
                handleDiagnose(chip.text);
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/15 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Diagnosis Results Card */}
        {diagnosis && (
          <div className="mt-6 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in border border-slate-200 space-y-6">
            
            {/* Top Match Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {diagnosis.confidenceScore}% Match Confidence
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {diagnosis.urgency}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    AI Diagnosis: {diagnosis.diagnosis}
                  </h4>
                </div>
              </div>
            </div>

            {/* Service Recommendation Card */}
            {diagnosis.service && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <img
                    src={diagnosis.service.thumbnail || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300'}
                    alt={diagnosis.service.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-royal uppercase tracking-wider">
                      {diagnosis.service.category_name}
                    </span>
                    <h5 className="text-base font-black text-slate-900">
                      {diagnosis.service.title}
                    </h5>
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-lg">
                      {diagnosis.service.short_description}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Free Rework Guarantee
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {diagnosis.service.duration_minutes || 60} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 font-medium">Estimated Pricing</p>
                    <p className="text-xl sm:text-2xl font-black text-brand-royal">
                      {formatCurrency(diagnosis.service.discounted_price || diagnosis.service.base_price)}
                    </p>
                  </div>

                  <Link href={`/book/${diagnosis.service.slug}`}>
                    <Button variant="accent" size="sm" icon={ArrowRight} iconPosition="right" className="shadow-md">
                      Book Technician
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Emergency Advice */}
            {diagnosis.emergencyAdvice && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-bold block mb-0.5">Safety & Pre-Arrival Precaution:</strong>
                  {diagnosis.emergencyAdvice}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-rose-500/20 border border-rose-400/40 rounded-xl p-4 text-center text-xs text-rose-200">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
