'use client';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-1/4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-52 bg-gray-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
