'use client';

import { SortOption } from '@/lib/types';
import { ArrowUpDown, Calendar, Building2, Type } from 'lucide-react';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'date-asc', label: 'Soonest', icon: <Calendar className="w-4 h-4" />, color: 'brand-orange' },
  { value: 'date-desc', label: 'Latest', icon: <Calendar className="w-4 h-4" />, color: 'brand-blue' },
  { value: 'org-asc', label: 'Org', icon: <Building2 className="w-4 h-4" />, color: 'brand-purple' },
  { value: 'name-asc', label: 'Name', icon: <Type className="w-4 h-4" />, color: 'brand-teal' },
];

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mr-1">Sort</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(({ value, label, icon, color }) => {
          const isActive = currentSort === value;
          return (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? `bg-${color} text-white shadow-colored scale-105`
                  : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-200 hover:shadow-subtle'
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