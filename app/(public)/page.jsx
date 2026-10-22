import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Sofa,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Car,
  Scale,
  Sparkles,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  PhoneCall,
  Search,
  BadgePercent,
  ThumbsUp,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RatingStars from '@/components/ui/RatingStars';
import SmartServiceWizard from '@/components/home/SmartServiceWizard';
import { query } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

// Icon map for dynamic category rendering
const ICON_MAP = {
  Wrench,
  Sofa,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Car,
  Scale,
  Sparkles,
  Briefcase,
  ShieldAlert,
};

async function getHomePageData() {
  try {
    const categories = await query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.status = 'active') as services_count
       FROM categories c
       WHERE c.status = 'active'
       ORDER BY c.sort_order ASC, c.id ASC`
    );

    const featuredServices = await query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug
       FROM services s
       JOIN categories c ON s.category_id = c.id
       WHERE s.status = 'active' AND s.is_featured = 1
       ORDER BY s.rating DESC
       LIMIT 8`
    );

    const testimonials = await query(
      `SELECT * FROM testimonials WHERE is_featured = 1 LIMIT 3`
    );

    const faqs = await query(
      `SELECT * FROM faqs WHERE status = 'active' ORDER BY sort_order ASC LIMIT 6`
    );

    return { categories, featuredServices, testimonials, faqs };
  } catch (err) {
    console.error('Error fetching home page data:', err);
    return { categories: [], featuredServices: [], testimonials: [], faqs: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredServices, testimonials, faqs } = await getHomePageData();

  const popularPills = [
    { label: 'Deep Cleaning', query: 'Deep Cleaning', icon: '🧹' },
    { label: 'AC Foam Jet', query: 'AC', icon: '❄️' },
    { label: 'Elder Attendant', query: 'Elder Care', icon: '👵' },
    { label: 'Electrician', query: 'Electrician', icon: '⚡' },
    { label: 'Home Tutor', query: 'Tutor', icon: '📚' },
    { label: 'Wedding Photo', query: 'Photography', icon: '📸' },
    { label: 'Salon at Home', query: 'Salon', icon: '✨' },
    { label: 'Last Rites Support', query: 'Funeral', icon: '🕊️' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION (REDESIGNED FOR MAXIMUM APPEAL) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200/60">
        
        {/* Ambient Glow Orbs & Background Tech Grid */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-10 w-[450px] h-[350px] bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* FLOATING GLASS CARDS ON SIDES (XL DESKTOP SCREENS) */}
        {/* Left Floating Card 1: AC Jet Cleaning */}
        <div className="hidden xl:flex absolute left-6 lg:left-12 top-28 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-elevated border border-slate-200/80 items-center gap-3 animate-float max-w-[215px]">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold text-lg flex-shrink-0">
            ❄️
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">AC Foam Power Jet</p>
            <p className="text-[11px] text-emerald-600 font-black">₹699 • ⭐ 4.9 (420+)</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Verified Technician</span>
          </div>
        </div>

        {/* Left Floating Card 2: 15-Min Ambulance SOS */}
        <div className="hidden xl:flex absolute left-10 lg:left-16 top-64 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-elevated border border-slate-200/80 items-center gap-3 animate-float-delayed max-w-[225px]">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            🚑
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <p className="text-xs font-black text-red-700 leading-tight">15-Min Rapid SOS</p>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">Ambulance & Last Rites</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">24x7 Priority Dispatch</span>
          </div>
        </div>

        {/* Right Floating Card 1: Certified Elder Nurse */}
        <div className="hidden xl:flex absolute right-6 lg:right-12 top-28 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-elevated border border-slate-200/80 items-center gap-3 animate-float-delayed max-w-[225px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            👵
          </div>
          <div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <p className="text-xs font-bold text-slate-900 leading-tight">Elder Care Nurse</p>
            </div>
            <p className="text-[11px] text-emerald-700 font-black">Certified Vitals Care</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">100% Police Verified</span>
          </div>
        </div>

        {/* Right Floating Card 2: 30-Day Guarantee */}
        <div className="hidden xl:flex absolute right-10 lg:right-16 top-64 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-elevated border border-slate-200/80 items-center gap-3 animate-float max-w-[215px]">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            🛡️
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Jeevan Suraksha</p>
            <p className="text-[11px] text-amber-700 font-black">30-Day Free Rework</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Doorstep OTP Security</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 via-white to-amber-50 text-brand-royal text-xs font-bold border border-blue-200/80 shadow-2xs hover:scale-105 transition-transform cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>India’s 1st Unified Life Care Ecosystem</span>
              <span className="text-slate-300">•</span>
              <span className="text-accent-600 font-extrabold">28+ States Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Every Service You Need — <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-royal via-blue-700 to-indigo-800">
                From Birth
              </span>{' '}
              to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-orange-500 to-amber-500">
                Beyond.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Book verified doorstep technicians, elderly attendants, Vedic pandits, tutors, and dignified sacred last rites with transparent upfront pricing and 30-day warranty.
            </p>

            {/* Hero Search Box */}
            <div className="pt-2 max-w-2xl sm:max-w-3xl mx-auto">
              <form action="/services" method="GET" className="bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl border-2 border-slate-200/90 focus-within:border-brand-royal focus-within:ring-4 focus-within:ring-blue-100 transition-all flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 w-full px-4 py-2 flex-1">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-brand-royal flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-brand-royal" />
                  </div>
                  <input
                    type="text"
                    name="q"
                    placeholder="Search any service (e.g. AC Repair, Deep Cleaning, Elder Care, Pandit)..."
                    className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-accent-500 to-orange-500 hover:from-accent-600 hover:to-orange-600 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <span>Search Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Popular Search Pills with colorful micro-icons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Popular:</span>
                {popularPills.map((pill) => (
                  <Link
                    key={pill.label}
                    href={`/services?q=${encodeURIComponent(pill.query)}`}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 hover:border-brand-royal hover:text-brand-royal hover:shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upgraded Hero Stats Bar to Floating Glass Cards */}
            <div className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all text-center group">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-500">Police & Skill Verified</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all text-center group">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">4.92 ★</p>
                <p className="text-xs font-bold text-slate-500">12,800+ User Reviews</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all text-center group">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-brand-royal" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">30 Days</p>
                <p className="text-xs font-bold text-slate-500">Free Rework Guarantee</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all text-center group">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-red-600">15 Mins</p>
                <p className="text-xs font-bold text-slate-500">Emergency SOS Dispatch</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. AI SMART PROBLEM DIAGNOSTIC WIZARD (JEEVAN MITRA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <SmartServiceWizard />
      </section>

      {/* 3. 10 LIFE STAGES CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="blue" size="sm" className="mb-2">Comprehensive Catalog</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Life Services Across Every Stage
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select any life stage category to find specialized, vetted experts in your city.
            </p>
          </div>
          <Link href="/categories">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            return (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-royal shadow-soft hover:shadow-elevated transition-all duration-200 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-royal flex items-center justify-center mb-3 group-hover:bg-brand-royal group-hover:text-white transition-colors duration-200">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-royal transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {cat.tagline || 'Doorstep solutions'}
                </p>
                <span className="mt-3 text-[10px] font-bold text-accent-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full">
                  {cat.services_count || 5}+ Services
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="orange" size="sm" className="mb-2">Most Popular</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Doorstep Services
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Top-rated verified services with instant booking and warranty assurance.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              Explore All {featuredServices.length}+
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => {
            const hasDiscount = service.discount_price && service.discount_price < service.base_price;
            const finalPrice = hasDiscount ? service.discount_price : service.base_price;
            const savings = hasDiscount ? Math.round(((service.base_price - service.discount_price) / service.base_price) * 100) : 0;

            return (
              <Card
                key={service.id}
                hoverEffect
                padding="p-0"
                className="overflow-hidden flex flex-col group border border-slate-200"
              >
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={service.thumbnail || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {service.category_name}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <BadgePercent className="w-3 h-3" /> {savings}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <RatingStars rating={service.rating} totalReviews={service.total_reviews} size="sm" />
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {service.duration_minutes}m
                      </span>
                    </div>

                    <Link href={`/services/${service.slug}`}>
                      <h3 className="font-bold text-slate-900 text-sm hover:text-brand-royal transition-colors line-clamp-2 leading-snug">
                        {service.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {service.short_description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-900">
                          {formatCurrency(finalPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(service.base_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        Inclusive of all taxes
                      </span>
                    </div>

                    <Link href={`/book/${service.slug}`}>
                      <Button variant="accent" size="sm">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE US / VALUE PILLARS */}
      <section className="bg-brand-royal text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-800/80 px-3 py-1 rounded-full">
              Why Indian Families Choose JeevanSeva
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3 text-white tracking-tight">
              Trust, Dignity & High Quality in Every Visit
            </h2>
            <p className="text-sm text-blue-100 mt-2">
              Unlike generic classifieds, we don’t just share numbers. We manage quality from end to end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent-500 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Vetted & Police-Verified</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Every partner undergoes 3-tier identity checks, criminal background verification, and skills evaluation.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">30-Day Service Guarantee</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Happiness guaranteed. If an issue reoccurs or work is incomplete, we send an expert back free of charge.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Transparent Rate Cards</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Zero surprise bills. Package prices, labor rates, and part costs are fixed and pre-approved by you.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">24x7 Sacred & Emergency Care</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Specialized 24x7 team on call for home nursing, ambulances, and dignified funeral & antim sanskar arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge variant="blue" size="sm" className="mb-2">Simple 4-Step Process</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How JeevanSeva Works
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Book any service in under 2 minutes with seamless confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-royal font-black text-lg mx-auto flex items-center justify-center border-2 border-brand-200">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Select Service & Variant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse transparent service catalog and pick custom packages tailored to your house or occasion.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-royal font-black text-lg mx-auto flex items-center justify-center border-2 border-brand-200">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Pick Slot & Address</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your preferred date, convenient 2-hour arrival window, and saved delivery address.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-royal font-black text-lg mx-auto flex items-center justify-center border-2 border-brand-200">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Doorstep OTP &amp; Wallet Payment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pay via Cashfree, Wallet or COD. You receive a secret 4-digit doorstep security OTP to share only on arrival.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-royal font-black text-lg mx-auto flex items-center justify-center border-2 border-brand-200">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">Direct Chat &amp; 30-Day Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coordinate via in-app live chat. Verified specialist completes the job with a 30-day complete satisfaction guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-slate-100/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge variant="green" size="sm" className="mb-2">Stories of Trust</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Loved by 50,000+ Indian Families
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Read how JeevanSeva helped households with urgent care, repairs, and celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testi) => (
              <Card key={testi.id} className="p-6 space-y-4 flex flex-col justify-between border-slate-200">
                <div className="space-y-3">
                  <RatingStars rating={testi.rating} size="sm" />
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{testi.feedback}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={testi.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={testi.user_name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{testi.user_name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {testi.user_city} • <span className="text-brand-royal font-semibold">{testi.service_name}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="purple" size="sm" className="mb-2">Have Questions?</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Everything you need to know about booking, partner safety, and guarantees.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 open:shadow-xs"
            >
              <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-accent-500 font-bold text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 8. PARTNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-royal via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-elevated">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
              Partner With JeevanSeva
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Are You a Skilled Professional or Business Owner?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Grow your income with verified customer requests in your local area. Benefit from weekly direct payouts, zero lead fees, and dedicated partner manager support.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/register/provider">
                <Button variant="accent" size="lg">
                  Register as Service Partner
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Partner Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
