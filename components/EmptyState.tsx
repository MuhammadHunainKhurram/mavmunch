'use client';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center">
      <div className="w-20 h-20 bg-warm-100 dark:bg-warm-800 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-4xl" role="img" aria-label="search">
          {hasFilters ? '🔍' : '🍕'}
        </span>
      </div>

      {hasFilters ? (
        <>
          <h2 className="font-display text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
            Nothing matches your search
          </h2>
          <p className="text-warm-500 dark:text-warm-400 max-w-sm mb-8 leading-relaxed">
            Try different keywords or remove some filters to see more events.
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
          <h2 className="font-display text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
            Nothing cooking right now
          </h2>
          <p className="text-warm-500 dark:text-warm-400 max-w-sm leading-relaxed">
            Check back soon — orgs are always planning something. Free food pops up when you least expect it!
          </p>
        </>
      )}
    </div>
  );
}
