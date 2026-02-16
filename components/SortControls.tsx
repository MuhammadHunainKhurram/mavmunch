'use client';

import { SortOption } from '@/lib/types';
import { Calendar, Building2, Type } from 'lucide-react';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'date-asc', label: 'Soonest', icon: <Calendar className="w-4 h-4" /> },
  { value: 'date-desc', label: 'Latest', icon: <Calendar className="w-4 h-4" /> },
  { value: 'org-asc', label: 'Org', icon: <Building2 className="w-4 h-4" /> },
  { value: 'name-asc', label: 'Name', icon: <Type className="w-4 h-4" /> },
];

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-warm-500 dark:text-warm-400 mr-1">Sort</span>
      <div className="flex bg-warm-100 dark:bg-warm-800 rounded-xl p-1 gap-0.5">
        {sortOptions.map(({ value, label, icon }) => {
          const isActive = currentSort === value;
          return (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-uta-orange text-white shadow-orange'
                  : 'text-warm-600 dark:text-warm-400 hover:text-warm-900 dark:hover:text-warm-200'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}