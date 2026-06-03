'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  eventCount: number;
}

export function Header({ eventCount }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-warm-950/80 backdrop-blur-xl border-b border-warm-200 dark:border-warm-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-orange transform group-hover:rotate-6 transition-transform duration-300
                  ${isDark
                    ? 'bg-gradient-to-br from-uta-orange to-uta-orange-dark'
                    : 'bg-white'
                  }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    className={isDark ? 'text-white' : 'text-uta-orange'}
                  />
                </svg>
              </div>

              <div
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDuration: '2s' }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <span className="text-warm-900 dark:text-warm-100">Mav</span>
                <span className="text-uta-orange">Munch</span>
                <span className="text-uta-orange">!</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-warm-500 dark:text-warm-400 flex items-center gap-1">
                Free Food Finder
                <span className="inline-block animate-bounce">🍕</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-warm-100 dark:bg-warm-800 rounded-xl">
              <UtensilsCrossed className="w-4 h-4 text-warm-500 dark:text-warm-400" />
              <span className="text-sm font-bold text-warm-700 dark:text-warm-300">
                {eventCount}
              </span>
              <span className="text-xs font-medium text-warm-500 dark:text-warm-400 hidden sm:inline">
                events
              </span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-400 hover:bg-warm-200 dark:hover:bg-warm-700 transition-all duration-200"
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
