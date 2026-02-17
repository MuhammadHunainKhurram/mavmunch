'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, Search } from 'lucide-react';

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

  const filteredOrgs = organizations.filter(({ org }) =>
    org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (organizations.length === 0) return null;

  return (
    <div className="relative" style={{ zIndex: 9999 }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isOpen || selectedOrgs.length > 0
            ? 'bg-uta-orange text-white shadow-orange'
            : 'bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
        {selectedOrgs.length > 0 && (
          <span className="ml-0.5 px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold">
            {selectedOrgs.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 shadow-medium overflow-hidden rounded-2xl bg-white dark:bg-warm-900 border border-warm-200 dark:border-warm-800"
          style={{ zIndex: 9999 }}
        >
          <div className="p-3 border-b border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-900">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search organizations..."
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-xl text-sm font-medium focus:outline-none focus:border-uta-orange"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredOrgs.map(({ org, count }) => (
              <button
                key={org}
                onClick={() => handleToggleOrg(org)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 text-left ${
                  selectedOrgs.includes(org)
                    ? 'bg-uta-orange text-white'
                    : 'hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-300'
                }`}
              >
                <span className="pr-2 leading-tight" style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}>
                  {org}
                </span>
                <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-md ${
                  selectedOrgs.includes(org)
                    ? 'bg-white/20'
                    : 'bg-warm-200 dark:bg-warm-700 text-warm-500'
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