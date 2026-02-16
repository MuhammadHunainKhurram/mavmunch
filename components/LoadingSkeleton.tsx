'use client';

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Alert skeleton */}
      <div className="flex items-center gap-4 p-4 bg-warm-100 dark:bg-warm-800 rounded-2xl">
        <div className="w-12 h-12 bg-warm-200 dark:bg-warm-700 rounded-xl animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-warm-200 dark:bg-warm-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-warm-200 dark:bg-warm-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="card-modern p-6">
        <div className="h-14 w-full bg-warm-100 dark:bg-warm-800 rounded-2xl animate-pulse" />
      </div>

      {/* List skeleton */}
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card-modern flex items-stretch overflow-hidden">
            <div className={`w-20 sm:w-24 shrink-0 ${i % 2 === 0 ? 'bg-uta-orange/20' : 'bg-uta-blue/20'} animate-pulse`} />
            <div className="flex-1 p-5 space-y-3">
              <div className="h-3 w-32 bg-warm-200 dark:bg-warm-700 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-warm-200 dark:bg-warm-700 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-warm-200 dark:bg-warm-700 rounded-lg animate-pulse" />
                <div className="h-6 w-24 bg-warm-200 dark:bg-warm-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}