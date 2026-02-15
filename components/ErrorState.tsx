'use client';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = 'We couldn\'t load the latest events. Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center">
      <div className="card-campus p-8 sm:p-10 max-w-md w-full">
        <div className="w-16 h-16 bg-campus-red-light dark:bg-campus-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl" role="img" aria-label="warning">
            &#x26A0;&#xFE0F;
          </span>
        </div>

        <h2 className="font-display text-xl font-bold text-warm-900 dark:text-warm-100 mb-2">
          We hit a snag
        </h2>
        <p className="text-warm-500 dark:text-warm-400 text-sm leading-relaxed mb-6">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="btn-primary w-full"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
