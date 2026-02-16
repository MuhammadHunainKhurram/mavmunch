'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search events, organizations...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');

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
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-warm-400" />
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-warm-50 dark:bg-warm-900 border-2 border-warm-200 dark:border-warm-700 rounded-2xl text-warm-900 dark:text-warm-100 placeholder:text-warm-400 font-medium focus:outline-none focus:border-uta-orange focus:ring-4 focus:ring-uta-orange/10 transition-all duration-200"
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center justify-center w-10 h-10 my-auto rounded-xl text-warm-400 hover:text-warm-600 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}