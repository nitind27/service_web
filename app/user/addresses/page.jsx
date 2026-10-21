'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function UserAddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New address form fields
  const [title, setTitle] = useState('Home');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!addressLine.trim() || !city.trim() || !pincode.trim()) {
      toast.error('Please enter address line, city, and pincode');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          recipient_name: recipientName.trim(),
          recipient_phone: recipientPhone.trim(),
          address_line: addressLine.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          is_default: isDefault ? 1 : 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Address saved successfully!');
        setAddModalOpen(false);
        // Reset
        setAddressLine('');
        setLandmark('');
        setPincode('');
        fetchAddresses();
      } else {
        toast.error(data.message || 'Failed to save address');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Address deleted');
        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <DashboardLayout title="Saved Addresses">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manage Service Locations</h2>
            <p className="text-xs text-slate-500">Save your home, office, and family addresses for fast checkout.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setAddModalOpen(true)}>
            Add New Address
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-semibold">
            Loading saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-300 space-y-3">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No saved addresses</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your primary delivery address to speed up your future service bookings.
            </p>
            <Button variant="accent" size="sm" onClick={() => setAddModalOpen(true)}>
              Add Address
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <Card
                key={addr.id}
                className="p-5 border-slate-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                      {addr.title === 'Work' ? <Briefcase className="w-3.5 h-3.5 text-blue-600" /> : <Home className="w-3.5 h-3.5 text-accent-500" />}
                      {addr.title}
                    </span>
                    {addr.is_default === 1 && (
                      <Badge variant="green" size="sm">Default</Badge>
                    )}
                  </div>

                  {addr.recipient_name && (
                    <p className="text-xs font-bold text-slate-800">
                      {addr.recipient_name} {addr.recipient_phone ? `(${addr.recipient_phone})` : ''}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.address_line}
                    {addr.landmark ? `, Landmark: ${addr.landmark}` : ''}
                    <br />
                    {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Verified Doorstep Zone</span>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Service Address"
        size="md"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4">
          <div className="flex gap-2">
            {['Home', 'Work', 'Parents Home', 'Other'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTitle(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  title === t
                    ? 'bg-brand-royal text-white border-brand-royal'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Name"
              placeholder="e.g. Amitabh Roy"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <Input
              label="Contact Phone"
              placeholder="10-digit mobile"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
          </div>

          <Input
            label="Flat / House / Street Address"
            placeholder="e.g. Flat 402, Royal Palms, Sector 62"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Landmark"
              placeholder="Near Metro Station"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Pincode"
              placeholder="201301"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded accent-brand-royal"
            />
            <span>Set as primary default address for bookings</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
