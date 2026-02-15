'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'What sounds good?',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-campus-orange' : 'text-warm-400 dark:text-warm-500'}`} />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-warm-100 dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-xl text-warm-900 dark:text-warm-100 placeholder:text-warm-400 dark:placeholder:text-warm-500 font-medium focus:outline-none focus:border-campus-orange focus:ring-2 focus:ring-campus-orange/20 dark:focus:ring-campus-orange/30 transition-all duration-200"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center justify-center w-8 h-8 my-auto rounded-lg text-warm-400 hover:text-warm-600 dark:text-warm-500 dark:hover:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-warm-400 dark:text-warm-500 pl-1">
        Search by event, org, or location
      </p>
    </div>
  );
}
