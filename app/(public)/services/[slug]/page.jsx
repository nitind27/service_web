import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall,
  BadgePercent,
  ArrowRight,
  Share2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RatingStars from '@/components/ui/RatingStars';
import PincodeChecker from '@/components/common/PincodeChecker';
import { query, queryOne } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

async function getServiceDetails(slug) {
  try {
    const service = await queryOne(
      `SELECT s.*, 
        c.name as category_name, c.slug as category_slug,
        sc.name as subcategory_name,
        p.id as provider_id, p.business_name, p.experience_years, p.rating as provider_rating, p.total_reviews as provider_reviews, p.about as provider_about,
        u.mobile as provider_phone
       FROM services s
       JOIN categories c ON s.category_id = c.id
       LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
       LEFT JOIN providers p ON s.provider_id = p.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE s.slug = ?
       LIMIT 1`,
      [slug]
    );

    if (!service) return null;

    const variants = await query(
      `SELECT * FROM service_variants WHERE service_id = ? ORDER BY sort_order ASC, price ASC`,
      [service.id]
    );

    const reviews = await query(
      `SELECT r.*, u.name as customer_name, u.city as customer_city, u.profile_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.service_id = ? AND r.status = 'approved'
       ORDER BY r.created_at DESC
       LIMIT 6`,
      [service.id]
    );

    const related = await query(
      `SELECT id, title, slug, thumbnail, base_price, discount_price, rating, total_reviews
       FROM services
       WHERE category_id = ? AND id != ? AND status = 'active'
       LIMIT 3`,
      [service.category_id, service.id]
    );

    return { service, variants, reviews, related };
  } catch (err) {
    console.error('Error fetching service details:', err);
    return null;
  }
}

export default async function ServiceDetailPage({ params }) {
  const data = await getServiceDetails(params.slug);
  if (!data) notFound();

  const { service, variants, reviews, related } = data;

  const hasDiscount = service.discount_price && service.discount_price < service.base_price;
  const finalPrice = hasDiscount ? service.discount_price : service.base_price;
  const savings = hasDiscount ? Math.round(((service.base_price - service.discount_price) / service.base_price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-royal transition">Home</Link>
        <span>/</span>
        <Link href={`/services?category=${service.category_slug}`} className="hover:text-brand-royal transition">
          {service.category_name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{service.title}</span>
      </nav>

      {/* Main Grid: Details Left (2/3), Sticky Booking Box Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Service Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Media & Header */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft">
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={service.thumbnail || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-brand-royal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {service.category_name}
                </span>
                {savings > 0 && (
                  <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <BadgePercent className="w-3.5 h-3.5" /> Save {savings}%
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <RatingStars rating={service.rating} totalReviews={service.total_reviews} size="md" />
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Approx. {service.duration_minutes} Minutes
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {service.title}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {service.short_description}
              </p>

              {/* Guarantee Box */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-royal flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-brand-royal uppercase tracking-wider">
                    {service.service_guarantee || '30-Day Service Guarantee'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    If anything is not performed to your complete satisfaction, our team will revisit free of charge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <Card className="p-6 sm:p-8 space-y-4 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">What’s Included in this Service</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Included
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Police-verified technician
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Standard tools & equipment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cleanup after service completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 30-Day warranty coverage
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Important Notes
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Spare parts billed transparently
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Cash on delivery available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Free rescheduling up to 2 hours prior
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Package Variants (if any) */}
          {variants && variants.length > 0 && (
            <Card className="p-6 sm:p-8 space-y-4 border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Select Available Packages</h3>
                  <p className="text-xs text-slate-500">Pick the variant that best matches your space or needs.</p>
                </div>
                <Badge variant="blue">{variants.length} Options</Badge>
              </div>

              <div className="space-y-3 pt-2">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-brand-royal transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-white"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                      {v.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{v.description}</p>
                      )}
                      <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                        ⏱️ Duration: ~{v.duration_minutes} mins
                      </span>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          {formatCurrency(v.discount_price || v.price)}
                        </span>
                        {v.discount_price && (
                          <span className="text-xs text-slate-400 line-through block">
                            {formatCurrency(v.price)}
                          </span>
                        )}
                      </div>
                      <Link href={`/book/${service.slug}?variant=${v.id}`}>
                        <Button variant="accent" size="sm">
                          Select
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Assigned Provider Information */}
          {service.business_name && (
            <Card className="p-6 sm:p-8 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Assigned Service Provider Partner
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {service.business_name}
                    <Badge variant="green" size="sm">Verified Partner</Badge>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {service.experience_years || 5}+ Years Experience • {service.provider_reviews || 40}+ Verified Jobs Done
                  </p>
                  <RatingStars rating={service.provider_rating || 4.9} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Call support available post-booking</span>
                </div>
              </div>
            </Card>
          )}

          {/* Customer Reviews List */}
          <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h3>
                <p className="text-xs text-slate-500">Verified feedback from real completed bookings</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{service.rating}</span>
                <span className="text-xs text-slate-400 block">out of 5 stars</span>
              </div>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pb-4 border-b border-slate-100 last:border-none space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-royal font-bold text-xs flex items-center justify-center">
                          {rev.customer_name?.[0] || 'C'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.customer_name}</h4>
                          <span className="text-[10px] text-slate-400">{rev.customer_city || 'India'}</span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{rev.review_text}"
                    </p>
                    {rev.provider_reply && (
                      <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border-l-2 border-brand-royal">
                        <strong>Partner Reply:</strong> {rev.provider_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No customer reviews yet. Be the first to book and share your feedback!
              </p>
            )}
          </Card>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Action Card */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          <Card className="p-6 sm:p-7 border-slate-200 shadow-elevated space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-600 block">
              Transparent Doorstep Booking
            </span>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(service.base_price)}
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
                Save {formatCurrency(service.base_price - finalPrice)} today!
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1">
                <span>Estimated Duration:</span>
                <strong className="text-slate-800">{service.duration_minutes} Minutes</strong>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Service Guarantee:</span>
                <strong className="text-slate-800">30-Day Happiness</strong>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Payment Options:</span>
                <strong className="text-slate-800">Cashfree UPI / Cards / COD</strong>
              </div>
            </div>

            <Link href={`/book/${service.slug}`} className="block w-full">
              <Button variant="accent" size="lg" className="w-full text-base py-4 font-bold shadow-md">
                Book This Service Now
              </Button>
            </Link>

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Instant confirmation • Free cancellation up to 2 hrs before
            </p>
          </Card>

          {/* Area Pincode Availability Checker */}
          <PincodeChecker />

          {/* Emergency / Support Help Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-600" /> Need Instant Assistance?
            </h4>
            <p className="text-[11px] leading-relaxed">
              Our 24x7 customer support desk is available to assist you with customized bookings, elder care attendants, or emergency ambulances.
            </p>
            <a href="tel:+919876543210" className="inline-block font-bold text-amber-800 underline">
              Call Helpline: +91 98765 43210
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
