'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  eventCount: number;
}

export function Header({ eventCount }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-warm-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-warm-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-campus-orange to-orange-600 rounded-2xl flex items-center justify-center shadow-warm transform group-hover:rotate-6 transition-transform duration-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '2s' }} />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse-slow" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <span className="text-slate-900 dark:text-warm-100">Mav</span>
                <span className="text-campus-orange">Munch</span>
                <span className="text-orange-500">!</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-warm-400 flex items-center gap-1">
                Free food finder
                <span className="inline-block animate-bounce">🍕</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-campus-blue-soft dark:bg-campus-blue/10 rounded-full border-2 border-campus-blue-light dark:border-campus-blue/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
              <span className="text-sm font-bold text-campus-blue-dark dark:text-campus-blue-light">
                {eventCount} events
              </span>
            </div>

            <div className="sm:hidden flex items-center justify-center w-10 h-10 bg-campus-orange-light dark:bg-campus-orange/10 rounded-full">
              <span className="text-lg font-bold text-campus-orange">{eventCount}</span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-warm-950 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
