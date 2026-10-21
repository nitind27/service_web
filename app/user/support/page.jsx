'use client';

import React, { useState } from 'react';
import { Headphones, PhoneCall, Mail, MessageSquare, Plus, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export default function UserSupportPage() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticket_number: 'TKT-20261021-001',
      subject: 'Query regarding arrival time of cleaning team',
      status: 'open',
      priority: 'medium',
      created_at: '2026-10-21',
      last_message: 'Our cleaning supervisor has updated the arrival window to 10:30 AM.',
    },
  ]);

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please enter a subject and message');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: Date.now(),
        ticket_number: `TKT-${Date.now().toString().slice(-6)}`,
        subject: subject.trim(),
        status: 'open',
        priority: 'high',
        created_at: new Date().toISOString().split('T')[0],
        last_message: message.trim(),
      };
      setTickets([newTicket, ...tickets]);
      toast.success('Support ticket raised! A support manager will reply shortly.');
      setModalOpen(false);
      setSubject('');
      setMessage('');
      setSubmitting(false);
    }, 400);
  };

  return (
    <DashboardLayout title="Help & Support Desk">
      <div className="space-y-6 max-w-4xl">
        
        {/* Support Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent-500 flex items-center justify-center font-bold flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">24x7 Customer Helpline</span>
              <a href="tel:+919876543210" className="text-base font-black text-slate-900 hover:text-accent-600">
                +91 98765 43210
              </a>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center font-bold flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Email Desk</span>
              <a href="mailto:support@jeevanseva.in" className="text-base font-black text-slate-900 hover:text-brand-royal">
                support@jeevanseva.in
              </a>
            </div>
          </Card>
        </div>

        {/* Tickets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Support Inquiries</h2>
              <p className="text-xs text-slate-500">Track resolution progress on service queries or complaints.</p>
            </div>
            <Button variant="accent" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
              Raise Ticket
            </Button>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <Card key={t.id} className="p-5 border-slate-200 shadow-soft space-y-2 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-brand-royal uppercase">
                      {t.ticket_number} • Created {t.created_at}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{t.subject}</h3>
                  </div>
                  <Badge variant={t.status === 'open' ? 'orange' : 'green'} size="sm">
                    {t.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {t.last_message}
                </p>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* RAISE TICKET MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Raise a Support Ticket"
        size="md"
      >
        <form onSubmit={handleRaiseTicket} className="space-y-4">
          <Input
            label="Subject"
            placeholder="e.g. Query about technician arrival / Refund request"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Description"
            placeholder="Please explain the issue or question..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={submitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
