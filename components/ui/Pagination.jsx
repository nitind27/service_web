'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  // Smart page windowing algorithm (handles 2 to 500+ pages without overflowing)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className={`flex items-center justify-between border-t border-slate-200/80 px-4 py-3 sm:px-6 bg-white/70 backdrop-blur-xs rounded-b-2xl ${className}`}>
      
      {/* Mobile Pagination View */}
      <div className="flex flex-1 justify-between items-center sm:hidden">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-2xs"
        >
          Previous
        </button>
        <span className="text-xs font-bold text-slate-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-2xs"
        >
          Next
        </button>
      </div>

      {/* Desktop Pagination View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            {totalItems ? (
              <>
                Showing <span className="font-bold text-slate-900">{startItem}</span> to{' '}
                <span className="font-bold text-slate-900">{endItem}</span> of{' '}
                <span className="font-bold text-slate-900">{totalItems}</span> results
              </>
            ) : (
              <>
                Showing Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </>
            )}
          </p>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-2xs" aria-label="Pagination">
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-xl px-2.5 py-1.5 text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed transition bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {pages.map((item, idx) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="relative inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-400 ring-1 ring-inset ring-slate-300 bg-slate-50"
                  >
                    ...
                  </span>
                );
              }

              const page = item;
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-3.5 py-1.5 text-xs font-bold ring-1 ring-inset ring-slate-300 focus:z-20 transition ${
                    isCurrent
                      ? 'z-10 bg-brand-royal text-white ring-brand-royal shadow-xs'
                      : 'text-slate-700 bg-white hover:bg-slate-50 hover:text-brand-royal'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Arrow */}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-xl px-2.5 py-1.5 text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed transition bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
