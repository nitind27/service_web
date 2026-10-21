'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
        Something Went Wrong
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
        An unexpected error occurred while loading this page. Our technical team has been notified.
      </p>
      <div className="flex gap-3">
        <Button variant="accent" icon={RefreshCw} onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" icon={Home}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
