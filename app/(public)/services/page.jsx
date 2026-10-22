'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  ArrowRight,
  BadgePercent,
  X,
  MapPin,
  Tag,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RatingStars from '@/components/ui/RatingStars';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import LocationSelector from '@/components/layout/LocationSelector';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const CITIES = ['All Cities', 'New Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Jaipur', 'Noida', 'Gurugram'];

const SORT_OPTIONS = [
  { label: 'Featured & Top Rated', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedCity && selectedCity !== 'All Cities') params.set('city', selectedCity);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('rating', minRating);
      if (sort) params.set('sort', sort);
      params.set('page', currentPage);
      params.set('limit', 10);

      const res = await fetch(`/api/services?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data.services || []);
        setMeta(data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [q, selectedCategory, selectedCity, minPrice, maxPrice, minRating, sort, currentPage]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleResetFilters = () => {
    setQ('');
    setSelectedCategory('');
    setSelectedCity('All Cities');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('featured');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-brand-royal transition">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Services Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find Any Life Service You Need
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Showing {meta.total} verified doorstep services with instant online booking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-accent-500" />
            Filters
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR - Sticky pinned while services list scrolls */}
        <aside className="hidden lg:block w-72 flex-shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent-500" /> Filter Services
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-royal font-semibold hover:underline"
            >
              Reset All
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. AC, Deep Clean, Nurse"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pl-8 outline-none focus:bg-white focus:border-brand-royal"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-500" /> State / City
            </label>
            <LocationSelector
              value={selectedCity}
              onChange={(c) => {
                setSelectedCity(c);
                setCurrentPage(1);
              }}
              compact={false}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                className={`w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === '' ? 'bg-brand-50 text-brand-royal' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                  className={`w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center justify-between ${
                    selectedCategory === cat.slug ? 'bg-brand-50 text-brand-royal font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">({cat.services_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:bg-white focus:border-brand-royal"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:bg-white focus:border-brand-royal"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[4.5, 4.0, 3.5].map((rate) => (
                <label key={rate} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 py-1">
                  <input
                    type="radio"
                    name="rating_filter"
                    checked={minRating === String(rate)}
                    onChange={() => { setMinRating(String(rate)); setCurrentPage(1); }}
                    className="accent-brand-royal"
                  />
                  <span>{rate}★ & Above</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN SERVICES GRID & PAGINATION */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
                  <Skeleton className="h-44 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              title="No services match your filters"
              description="We couldn't find any services matching your current search criteria. Try removing filters or searching for another term."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => {
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

                          {service.service_guarantee && (
                            <div className="mt-2 text-[11px] text-brand-royal font-semibold flex items-center gap-1">
                              <span>🛡️</span> {service.service_guarantee}
                            </div>
                          )}
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
                              Instant Confirmation
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

              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                pageSize={meta.limit || 10}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500 font-semibold">Loading catalog...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
