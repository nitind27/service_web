import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Users, Sparkles, PhoneCall } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-600 bg-orange-50 px-3 py-1 rounded-full">
          Our Purpose
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Standing Beside Indian Families Through Every Chapter of Life
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          From celebrating a newborn with naming ceremony pandits, fixing a sparking MCB, caring for our elderly parents, to honoring departures with sacred last rites — JeevanSeva was built to bring dignity and trust to doorstep care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Empathy at Core</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every service is executed with deep compassion, whether it is a gentle elder care attendant or a home deep cleaning team.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Rigorous Safety</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Police verification, criminal record scanning, and in-person skill evaluations ensure your home remains safe.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-accent-500 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Empowering Partners</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We help skilled Indian workers, nurses, technicians, and local pandits earn sustainable, dignified incomes.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-brand-royal text-white space-y-4 text-center">
        <h2 className="text-2xl font-bold">Have Questions or Need Customized Care?</h2>
        <p className="text-xs text-blue-100 max-w-lg mx-auto">
          Our team is available 24x7 to assist you with special healthcare packages, wedding coordination, and sacred rituals.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link href="/contact">
            <Button variant="accent">Contact Customer Desk</Button>
          </Link>
          <a href="tel:+919876543210">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Helpline: +91 98765 43210
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
