'use client';

import React, { useState } from 'react';
import { Headphones, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function SubAdminTicketsPage() {
  const toast = useToast();
  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticket_number: 'TKT-20261021-001',
      customer_name: 'Amitabh Roy',
      subject: 'Query regarding arrival time of cleaning team',
      status: 'open',
      priority: 'medium',
      created_at: '2026-10-21',
      message: 'Hello, can the cleaning team arrive precisely at 10:30 AM instead of 10:00 AM?',
    },
  ]);

  const handleResolve = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
    toast.success('Ticket marked as resolved');
  };

  return (
    <DashboardLayout title="Customer Support Inquiries">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Support Inquiries Desk</h2>
            <p className="text-xs text-slate-500">Manage customer queries, complaints, and service adjustments.</p>
          </div>
        </div>

        <div className="space-y-4">
          {tickets.map((t) => (
            <Card key={t.id} className="p-6 border-slate-200 shadow-soft space-y-3 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-royal uppercase">
                    {t.ticket_number} • Customer: {t.customer_name} • {t.created_at}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{t.subject}</h3>
                </div>
                <Badge variant={t.status === 'open' ? 'orange' : 'green'}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{t.message}"
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                {t.status === 'open' && (
                  <Button variant="success" size="sm" onClick={() => handleResolve(t.id)}>
                    Mark Resolved
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
