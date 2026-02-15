'use client';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
      <div className="text-6xl sm:text-7xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
        🔍
      </div>

      {hasFilters ? (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
            No events found
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mb-8">
            Try adjusting your filters or check back later for more free food events!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium active:scale-95"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
            No free food events yet
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md">
            Check back soon! Organizations are always planning their next free food event.
            Keep refreshing! 🍕
          </p>
        </>
      )}
    </div>
  );
}