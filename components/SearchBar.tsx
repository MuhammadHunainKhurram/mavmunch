'use client';

import { useState, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for free food events...',
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
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-brand-orange' : 'text-slate-400'}`} />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all shadow-soft"
      />
      
      {query ? (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center justify-center w-8 h-8 my-auto bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      ) : (
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <Sparkles className="w-5 h-5 text-brand-yellow" />
        </div>
      )}
    </div>
  );
}