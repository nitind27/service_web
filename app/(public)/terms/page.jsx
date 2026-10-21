import React from 'react';
import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Terms & Conditions of Service</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <Card className="p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By booking any home, family, healthcare, education, event, legal, or last rites service through the JeevanSeva marketplace, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Service Booking & Cancellation Policy</h2>
          <p>
            Customers may reschedule or cancel any scheduled service booking free of charge up to 2 hours prior to the designated arrival window. Cancellations within 2 hours may incur a nominal cancellation fee of ₹99 to compensate the dispatched service technician.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. 30-Day Happiness Guarantee</h2>
          <p>
            Home cleaning, electrical, and appliance repairs are protected under our 30-day service warranty. In the event of recurring faults or dissatisfaction, a complimentary revisit will be arranged within 48 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Payment & Gateway Security</h2>
          <p>
            All online transactions are processed through Cashfree Payment Gateway under 256-bit SSL encryption and RBI-approved PCI-DSS compliance standards. In eligible categories, Pay After Service (Cash on Delivery) is offered.
          </p>
        </section>
      </Card>
    </div>
  );
}
