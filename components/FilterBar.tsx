'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter, Search } from 'lucide-react';

interface FilterBarProps {
  organizations: { org: string; count: number }[];
  selectedOrgs: string[];
  onFilterChange: (orgs: string[]) => void;
}

export function FilterBar({
  organizations,
  selectedOrgs,
  onFilterChange,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOrg = (org: string) => {
    if (selectedOrgs.includes(org)) {
      onFilterChange(selectedOrgs.filter((o) => o !== org));
    } else {
      onFilterChange([...selectedOrgs, org]);
    }
  };

  const handleClearAll = () => {
    onFilterChange([]);
    setSearchTerm('');
  };

  const filteredOrgs = organizations.filter(({ org }) =>
    org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (organizations.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-warm-950 ${
            isOpen || selectedOrgs.length > 0
              ? 'bg-campus-orange text-white shadow-warm'
              : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {selectedOrgs.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 bg-white/20 rounded-md text-xs font-semibold">
              {selectedOrgs.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {selectedOrgs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-warm-500 hover:text-campus-red dark:text-warm-400 dark:hover:text-campus-red transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {selectedOrgs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedOrgs.map((org) => (
            <span
              key={org}
              className="chip bg-campus-orange-soft dark:bg-campus-orange/10 text-campus-orange-dark dark:text-campus-orange"
            >
              {org}
              <button
                onClick={() => handleToggleOrg(org)}
                className="w-4 h-4 flex items-center justify-center rounded hover:bg-campus-orange/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 card-campus shadow-medium z-20 overflow-hidden">
          <div className="p-3 border-b border-warm-200 dark:border-warm-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 dark:text-warm-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orgs..."
                className="w-full pl-9 pr-3 py-2 bg-warm-100 dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-lg text-sm font-medium text-warm-900 dark:text-warm-100 placeholder:text-warm-400 dark:placeholder:text-warm-500 focus:outline-none focus:border-campus-orange transition-colors"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredOrgs.map(({ org, count }) => (
              <button
                key={org}
                onClick={() => handleToggleOrg(org)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange ${
                  selectedOrgs.includes(org)
                    ? 'bg-campus-orange text-white'
                    : 'hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-300'
                }`}
              >
                <span className="truncate pr-2">{org}</span>
                <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-md ${
                  selectedOrgs.includes(org)
                    ? 'bg-white/20'
                    : 'bg-warm-200 dark:bg-warm-700 text-warm-500 dark:text-warm-400'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
