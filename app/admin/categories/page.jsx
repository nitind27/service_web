'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Plus, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), tagline, description, icon, image }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Category created successfully!');
        setModalOpen(false);
        setName('');
        setTagline('');
        setDescription('');
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Life Service Categories">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Life Stages Catalog ({categories.length} Categories)</h2>
            <p className="text-xs text-slate-500">Configure marketplace departments from birth to beyond.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Card key={c.id} className="p-5 border-slate-200 shadow-soft space-y-3 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <span className="text-[10px] text-brand-royal font-semibold">Slug: {c.slug}</span>
                </div>
                <Badge variant="blue" size="sm">{c.services_count || 0} Services</Badge>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Icon: {c.icon}</span>
                <Badge variant={c.status === 'active' ? 'green' : 'gray'} size="sm">
                  {c.status.toUpperCase()}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

      </div>

      {/* ADD CATEGORY MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Life Service Category"
        size="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Pet Care & Veterinary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Catchy Tagline"
            placeholder="e.g. Doorstep grooming & veterinary care"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Describe the category scope..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Lucide Icon Name"
              placeholder="Sparkles, Heart, Shield..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
            <Input
              label="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
