'use client';

import { useState } from 'react';
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
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
            isOpen || selectedOrgs.length > 0
              ? 'bg-gradient-to-r from-brand-orange to-brand-rose text-white shadow-colored scale-105'
              : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {selectedOrgs.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-lg text-xs">
              {selectedOrgs.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {selectedOrgs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 text-sm font-bold text-slate-500 hover:text-brand-rose transition-colors"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange-light text-brand-orange-dark text-sm font-bold rounded-xl border-2 border-brand-orange/20"
            >
              {org}
              <button
                onClick={() => handleToggleOrg(org)}
                className="w-5 h-5 flex items-center justify-center bg-brand-orange/10 rounded-lg hover:bg-brand-orange/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border-2 border-slate-100 shadow-medium z-20 overflow-hidden">
          <div className="p-3 border-b-2 border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orgs..."
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredOrgs.map(({ org, count }) => (
              <button
                key={org}
                onClick={() => handleToggleOrg(org)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 ${
                  selectedOrgs.includes(org)
                    ? 'bg-brand-orange text-white shadow-soft'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate pr-2">{org}</span>
                <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-lg ${selectedOrgs.includes(org) ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
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