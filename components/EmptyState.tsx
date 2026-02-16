'use client';

import { UtensilsCrossed } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-uta-blue/10 rounded-2xl flex items-center justify-center mb-6">
        {hasFilters ? (
          <span className="text-4xl">🔍</span>
        ) : (
          <UtensilsCrossed className="w-10 h-10 text-uta-blue" />
        )}
      </div>

      {hasFilters ? (
        <>
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
            No matches found
          </h2>
          <p className="text-uta-blue max-w-sm mb-8 leading-relaxed">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
            Nothing cooking right now
          </h2>
          <p className="text-uta-blue max-w-sm leading-relaxed">
            Check back soon — free food events are added regularly!
          </p>
        </>
      )}
    </div>
  );
}