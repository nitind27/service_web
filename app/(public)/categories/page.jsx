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
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { query } from '@/lib/db';

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

async function getCategoriesData() {
  try {
    const categories = await query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.status = 'active') as services_count
       FROM categories c
       WHERE c.status = 'active'
       ORDER BY c.sort_order ASC, c.id ASC`
    );

    const subcategories = await query(
      `SELECT * FROM subcategories WHERE status = 'active' ORDER BY sort_order ASC`
    );

    return categories.map((cat) => ({
      ...cat,
      subcategories: subcategories.filter((s) => s.category_id === cat.id),
    }));
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoriesData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="blue" size="sm">Life Stages Catalog</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore All 10 Life Care Categories
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From birth celebrations and daily home maintenance to compassionate elder care and sacred last rites, browse our full spectrum of trusted solutions.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Sparkles;
          return (
            <Card
              key={cat.id}
              hoverEffect
              className="p-6 sm:p-8 flex flex-col justify-between border-slate-200"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-royal flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {cat.name}
                      </h2>
                      <span className="text-xs font-semibold text-accent-600 block">
                        {cat.services_count || 5}+ Verified Services Available
                      </span>
                    </div>
                  </div>
                  <Link href={`/services?category=${cat.slug}`}>
                    <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                      Browse
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* Subcategories Pills */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Solutions in this Category:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/services?category=${cat.slug}&q=${encodeURIComponent(sub.name)}`}
                          className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-royal hover:text-brand-royal hover:bg-blue-50/50 transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  Doorstep Service with 30-Day Guarantee
                </span>
                <Link href={`/services?category=${cat.slug}`}>
                  <span className="text-xs font-bold text-brand-royal hover:underline flex items-center gap-1">
                    View Catalog <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
