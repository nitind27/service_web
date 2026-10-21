import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-brand-royal flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The service page or resource you are looking for may have been moved or is currently unavailable.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="primary" icon={Home}>
            Back to Homepage
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="outline">
            Browse Services Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
