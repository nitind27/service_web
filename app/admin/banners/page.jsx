'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export default function AdminBannersPage() {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaLink, setCtaLink] = useState('/services');
  const [ctaText, setCtaText] = useState('Book Now');
  const [badgeText, setBadgeText] = useState('🔥 Hot Deal');
  const [sortOrder, setSortOrder] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners?all=true');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data.banners || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Title and Image URL are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim(),
          image_url: imageUrl.trim(),
          cta_link: ctaLink.trim() || '/services',
          cta_text: ctaText.trim() || 'Book Now',
          badge_text: badgeText.trim(),
          sort_order: parseInt(sortOrder || '0', 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Promotional work banner added successfully!');
        setModalOpen(false);
        setTitle('');
        setSubtitle('');
        setImageUrl('');
        fetchBanners();
      } else {
        toast.error(data.message || 'Failed to create banner');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Banner status set to ${newStatus.toUpperCase()}`);
        fetchBanners();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this promotional banner?')) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Banner removed successfully');
        fetchBanners();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <DashboardLayout title="Banners & Promotional Sliders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Homepage Banners ({banners.length})</h2>
            <p className="text-xs text-slate-500">Manage promotional hero banners, seasonal work campaigns, and festive highlights.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Work Banner
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-semibold">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-300">
            <p className="text-xs text-slate-500">No banners created yet. Click &quot;Add Work Banner&quot; above.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <Card key={b.id} className="p-0 overflow-hidden border-slate-200 shadow-soft flex flex-col justify-between">
                <div className="h-44 bg-slate-100 relative">
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="orange" size="sm">{b.badge_text}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Order: {b.sort_order}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{b.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{b.subtitle}</p>
                    <div className="pt-2 text-[11px] text-brand-royal font-semibold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Link: {b.cta_link}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className="cursor-pointer"
                    >
                      <Badge variant={b.status === 'active' ? 'green' : 'gray'} size="sm">
                        {b.status.toUpperCase()}
                      </Badge>
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-xs text-rose-500 font-semibold hover:text-rose-700 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE BANNER MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Promotional Work Banner"
        size="md"
      >
        <form onSubmit={handleCreateBanner} className="space-y-4">
          <Input
            label="Banner Main Headline"
            placeholder="e.g. Split AC Master Power Jet Servicing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Banner Subtitle / Value Proposition"
            placeholder="e.g. Deep anti-bacterial coil wash, gas pressure check & 2x cooling boost."
            rows={2}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <Input
            label="High-Res Work Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Badge Callout"
              placeholder="e.g. 🔥 Starting ₹499"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
            />
            <Input
              label="Display Order (Sort)"
              type="number"
              placeholder="1"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Button Action Text"
              placeholder="e.g. Book AC Service"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
            <Input
              label="Destination Link / Page"
              placeholder="e.g. /services?q=AC"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Publish Banner
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
