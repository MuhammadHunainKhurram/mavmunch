'use client';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = 'Failed to load events. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
      <div className="text-6xl sm:text-7xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
        ⚠️
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-slate-600 text-sm sm:text-base max-w-md mb-8">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}