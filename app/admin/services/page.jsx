'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, Plus, Star, Search, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Add Service Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch('/api/services?limit=100'),
        fetch('/api/categories'),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();

      if (sData.success) setServices(sData.data.services || []);
      if (cData.success) {
        setCategories(cData.data.categories || []);
        if (cData.data.categories?.length > 0) {
          setCategoryId(String(cData.data.categories[0].id));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!title.trim() || !basePrice || !categoryId) {
      toast.error('Please enter title, category, and base price');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          title: title.trim(),
          short_description: shortDesc.trim() || title.trim(),
          description: desc.trim() || title.trim(),
          base_price: parseFloat(basePrice),
          discount_price: discountPrice ? parseFloat(discountPrice) : null,
          duration_minutes: parseInt(duration || '60', 10),
          thumbnail: thumbnail.trim(),
          is_featured: isFeatured ? 1 : 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Service published to marketplace catalog!');
        setModalOpen(false);
        setTitle('');
        setBasePrice('');
        setDiscountPrice('');
        fetchCatalog();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = services.filter((s) => {
    if (categoryFilter && s.category_slug !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title?.toLowerCase().includes(q) ||
        s.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <DashboardLayout title="Master Services Catalog">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Marketplace Services ({services.length})</h2>
            <p className="text-xs text-slate-500">Configure catalog services, prices, variants, and featured items.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Service to Catalog
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-64 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 shadow-xs outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search service title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 pl-8 outline-none focus:border-brand-royal"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img src={s.thumbnail} alt={s.title} className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <p className="line-clamp-1">{s.title}</p>
                      <span className="text-[10px] text-slate-400">Slug: {s.slug}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 font-semibold">{s.category_name}</td>
                  <td className="p-4">
                    <span className="font-black text-slate-900">{formatCurrency(s.discount_price || s.base_price)}</span>
                    {s.discount_price && (
                      <span className="text-[10px] text-slate-400 line-through block">
                        {formatCurrency(s.base_price)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">~{s.duration_minutes}m</td>
                  <td className="p-4 font-bold text-slate-800">★ {s.rating}</td>
                  <td className="p-4">
                    {s.is_featured === 1 ? (
                      <Badge variant="orange" size="sm">Featured</Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Badge variant={s.status === 'active' ? 'green' : 'gray'} size="sm">
                      {s.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ADD SERVICE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Publish Service to Catalog"
        size="lg"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Life Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
              required
            />
            <Input
              label="Service Title"
              placeholder="e.g. 1 BHK Deep Sanitization & Scrub"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Base Price (₹)"
              type="number"
              placeholder="2499"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
            <Input
              label="Discount Price (₹)"
              type="number"
              placeholder="1999"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
            <Input
              label="Estimated Duration (Mins)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <Input
            label="Image Thumbnail URL"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />

          <Input
            label="Short Summary"
            placeholder="Key highlights in 1 line..."
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />

          <Textarea
            label="Detailed Scope of Work"
            placeholder="Details, process, equipment used..."
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded accent-brand-royal"
            />
            <span>Highlight as Featured on Homepage & Search</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Publish Service
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
