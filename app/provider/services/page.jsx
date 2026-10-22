'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Star, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';

export default function ProviderServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  // New service form fields
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async (targetPage = page) => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch(`/api/services?page=${targetPage}&limit=${pageSize}`),
        fetch('/api/categories'),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      if (sData.success) {
        setServices(sData.data.services || []);
        setTotalPages(sData.meta?.totalPages || sData.data?.totalPages || 1);
        setTotalCount(sData.meta?.total || sData.data?.total || 0);
      }
      if (cData.success) {
        setCategories(cData.data.categories || []);
        if (cData.data.categories?.length > 0) {
          setCategoryId((prev) => prev || String(cData.data.categories[0].id));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(page);
  }, [page]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!title.trim() || !basePrice || !categoryId) {
      toast.error('Please enter service title, category, and base price');
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Service added to catalog successfully!');
        setModalOpen(false);
        setTitle('');
        setBasePrice('');
        setDiscountPrice('');
        fetchServices();
      } else {
        toast.error(data.message || 'Failed to add service');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="My Service Catalog">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manage Offered Services ({totalCount})</h2>
            <p className="text-xs text-slate-500">Configure your rates, service descriptions, and packages.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Add New Service
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-semibold">
            Loading services...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.id} className="p-0 overflow-hidden border-slate-200 shadow-soft flex flex-col justify-between">
                <div className="h-40 bg-slate-100 relative">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {s.category_name}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{s.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{s.short_description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(s.discount_price || s.base_price)}
                      </span>
                      {s.discount_price && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          {formatCurrency(s.base_price)}
                        </span>
                      )}
                    </div>
                    <Badge variant={s.status === 'active' ? 'green' : 'gray'} size="sm">
                      {s.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
        />

      </div>

      {/* ADD SERVICE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Service to Catalog"
        size="lg"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Service Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
              required
            />
            <Input
              label="Service Title"
              placeholder="e.g. Master AC Servicing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Base Price (₹)"
              type="number"
              placeholder="999"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
            <Input
              label="Discount Price (₹)"
              type="number"
              placeholder="799"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
            <Input
              label="Duration (Mins)"
              type="number"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />

          <Input
            label="Short Summary"
            placeholder="Brief 1-line description for search cards"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />

          <Textarea
            label="Detailed Description & Inclusions"
            placeholder="Full service protocol and details..."
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Add Service
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
