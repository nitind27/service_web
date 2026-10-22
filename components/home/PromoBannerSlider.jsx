'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function PromoBannerSlider({ initialBanners = [] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* MAIN FEATURED SLIDER BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-slate-200/80 bg-slate-950 min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center">
        {/* Background Image with Dynamic Fade */}
        {banners.map((b, idx) => (
          <div
            key={b.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={b.image_url}
              alt={b.title}
              className="w-full h-full object-cover object-center transform scale-105 motion-safe:transition-transform motion-safe:duration-7000 motion-safe:hover:scale-100"
            />
            {/* Multi-gradient backdrop to ensure text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-4 sm:space-y-5">
          {/* Badge */}
          {current.badge_text && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/20 backdrop-blur-md border border-accent-400/40 text-accent-300 text-xs font-black tracking-wide shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badge_text}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] drop-shadow-md text-white">
            {current.title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-200/90 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow font-medium max-w-xl">
            {current.subtitle}
          </p>

          {/* Value Highlights Pill Row */}
          <div className="hidden sm:flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300 font-semibold">
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Police Verified
            </span>
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> On-Time Guarantee
            </span>
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> 30-Day Free Rework
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2 sm:pt-3">
            <Link href={current.cta_link || '/services'}>
              <Button
                variant="accent"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="shadow-xl shadow-accent-600/30 font-black text-sm px-7 py-3 rounded-xl hover:scale-105 transition-transform"
              >
                {current.cta_text || 'Book Service Now'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {banners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-7 h-2.5 bg-accent-500 shadow-md'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3 QUICK SERVICE HIGHLIGHT CARDS (PROMO STRIP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        <Link
          href="/services?q=AC"
          className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white overflow-hidden shadow-soft border border-blue-800/40 hover:shadow-elevated hover:border-blue-500 transition-all"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-800/60 px-2 py-0.5 rounded-md">
                ⚡ Season Special
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                AC Jet Power Wash
              </h4>
              <p className="text-[11px] text-blue-200">2x Cooling • Gas Check @ ₹499</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              ❄️
            </div>
          </div>
        </Link>

        <Link
          href="/services?category=home-services"
          className="group relative p-4 rounded-2xl bg-gradient-to-br from-amber-900 to-orange-950 text-white overflow-hidden shadow-soft border border-orange-800/40 hover:shadow-elevated hover:border-orange-500 transition-all"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-800/60 px-2 py-0.5 rounded-md">
                ✨ Deep Scrub
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                Full Home Cleaning
              </h4>
              <p className="text-[11px] text-amber-200">Hospital Grade • Flat 25% Off</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🧹
            </div>
          </div>
        </Link>

        <Link
          href="/services?q=Electrician"
          className="group relative p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white overflow-hidden shadow-soft border border-emerald-800/40 hover:shadow-elevated hover:border-emerald-500 transition-all"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-2 py-0.5 rounded-md">
                ⏱️ 60-Min Arrival
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                Instant Electrician
              </h4>
              <p className="text-[11px] text-emerald-200">Urgent Fixes & Wiring from ₹199</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              ⚡
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
