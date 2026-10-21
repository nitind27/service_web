import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({
  rating = 5,
  max = 5,
  totalReviews = null,
  size = 'md', // sm, md, lg
  className = '',
}) {
  const numericRating = Number(rating) || 0;

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        {[...Array(max)].map((_, i) => (
          <Star
            key={i}
            className={`${starSizes[size]} ${
              i < Math.floor(numericRating)
                ? 'fill-amber-400 text-amber-400'
                : i < numericRating
                ? 'fill-amber-200 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-bold text-slate-800 ${textSizes[size]}`}>
        {numericRating.toFixed(1)}
      </span>
      {totalReviews !== null && (
        <span className="text-xs text-slate-500 font-medium">({totalReviews})</span>
      )}
    </div>
  );
}
