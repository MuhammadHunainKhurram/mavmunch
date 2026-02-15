'use client';

const skeletonCardColors = ['sticky-yellow', 'sticky-orange', 'sticky-pink'];
const skeletonListColors = ['sticky-blue', 'sticky-green', 'sticky-yellow'];

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Featured section skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton-warm w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton-warm h-5 w-40 rounded-lg" />
          <div className="skeleton-warm h-3 w-28 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`sticky-note ${skeletonCardColors[i]} p-6 space-y-4`}>
            <div className="skeleton-warm h-4 w-24 !rounded-sm" />
            <div className="skeleton-warm h-5 w-full !rounded-sm" />
            <div className="skeleton-warm h-5 w-3/4 !rounded-sm" />
            <div className="space-y-2 pt-2">
              <div className="skeleton-warm h-4 w-40 !rounded-sm" />
              <div className="skeleton-warm h-4 w-32 !rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Search bar skeleton */}
      <div className="sticky-note sticky-yellow p-6">
        <div className="skeleton-warm h-12 w-full !rounded-sm" />
      </div>

      {/* List skeleton */}
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`sticky-note ${skeletonListColors[i]} p-5`}>
            <div className="space-y-3">
              <div className="skeleton-warm h-4 w-28 !rounded-sm" />
              <div className="skeleton-warm h-5 w-4/5 !rounded-sm" />
              <div className="flex gap-4">
                <div className="skeleton-warm h-4 w-36 !rounded-sm" />
                <div className="skeleton-warm h-4 w-28 !rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
