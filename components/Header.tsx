'use client';

interface HeaderProps {
  eventCount: number;
}

export function Header({ eventCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-rose rounded-2xl flex items-center justify-center shadow-colored transform group-hover:rotate-6 transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 text-white" 
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-yellow rounded-full animate-bounce-slight" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-brand-teal rounded-full animate-pulse-slow" />
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <span className="text-slate-900">Mav</span>
                <span className="text-brand-orange">Munch</span>
                <span className="text-brand-rose">!</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1">
                Free food finder 
                <span className="inline-block animate-bounce">🍕</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-blue-soft rounded-full border-2 border-brand-blue-light">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
              </span>
              <span className="text-sm font-bold text-brand-blue-dark">
                {eventCount} events
              </span>
            </div>
            
            <div className="sm:hidden flex items-center justify-center w-10 h-10 bg-brand-orange-light rounded-full">
              <span className="text-lg font-bold text-brand-orange">{eventCount}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}