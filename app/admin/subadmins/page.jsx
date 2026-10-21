'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function AdminSubAdminsPage() {
  const toast = useToast();
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('Subadmin@123');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubadmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users?roleId=2');
      const data = await res.json();
      if (data.success) {
        setSubadmins(data.data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
  }, []);

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    if (!name || !email || !mobile) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          role: 'subadmin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Sub-Admin staff member created successfully!');
        setModalOpen(false);
        setName('');
        setEmail('');
        setMobile('');
        fetchSubadmins();
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
    <DashboardLayout title="Operations Sub-Admins">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sub-Admin Staff ({subadmins.length})</h2>
            <p className="text-xs text-slate-500">Staff members with assigned operational permissions.</p>
          </div>
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Sub-Admin
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">City</th>
                <th className="p-4">Permissions</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subadmins.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-bold text-slate-900">{s.name}</td>
                  <td className="p-4 text-slate-600">{s.email}</td>
                  <td className="p-4 text-slate-800 font-semibold">{s.mobile}</td>
                  <td className="p-4 text-slate-600">{s.city}</td>
                  <td className="p-4">
                    <span className="text-[11px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-bold">
                      Bookings, Services & Partners
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Badge variant={s.status === 'active' ? 'green' : 'red'}>
                      {s.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ADD SUB-ADMIN MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Operations Sub-Admin Staff"
        size="md"
      >
        <form onSubmit={handleCreateSubAdmin} className="space-y-4">
          <Input
            label="Staff Name"
            placeholder="e.g. Neha Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Staff Email"
              type="email"
              placeholder="neha.subadmin@jeevanseva.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="10-Digit Mobile"
              placeholder="9811000002"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <Input
            label="Initial Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Create Sub-Admin
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
