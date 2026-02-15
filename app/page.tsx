'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { SortControls } from '@/components/SortControls';
import { SearchBar } from '@/components/SearchBar';
import { EventList } from '@/components/EventList';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { Leaderboard } from '@/components/Leaderboard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { getFreeFoodEvents } from '@/lib/api';
import {
  getApprovedSubmittedEvents,
  getPastSubmittedEvents,
} from '@/lib/firebaseService';
import {
  sortEvents,
  filterByOrganizations,
  getOrganizationsWithCounts,
} from '@/lib/utils';
import { MavEngageEvent, SortOption } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { Trophy, List, Sparkles, Utensils } from 'lucide-react';

type AnyEvent = MavEngageEvent | SubmittedEvent;

function isApiEvent(event: AnyEvent): event is MavEngageEvent {
  return 'startsOn' in event;
}

function getEventName(event: AnyEvent): string {
  return isApiEvent(event) ? event.name : event.title;
}

function getEventDescription(event: AnyEvent): string {
  return isApiEvent(event) ? event.description : event.description;
}

export default function Home() {
  const [apiEvents, setApiEvents] = useState<MavEngageEvent[]>([]);
  const [submittedEvents, setSubmittedEvents] = useState<SubmittedEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<SubmittedEvent[]>([]);
  const [allEvents, setAllEvents] = useState<AnyEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AnyEvent[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [api, submitted, past] = await Promise.all([
        getFreeFoodEvents(60),
        getApprovedSubmittedEvents(60),
        getPastSubmittedEvents(12),
      ]);

      setApiEvents(api);
      setSubmittedEvents(submitted);
      setPastEvents(past);
      setAllEvents([...api, ...submitted] as AnyEvent[]);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    let result = filterByOrganizations(allEvents as any, selectedOrgs);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event: AnyEvent) => {
        const name = getEventName(event);
        const org = event.organizationName;
        const location = event.location;
        const description = getEventDescription(event);

        return (
          name.toLowerCase().includes(query) ||
          org.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    result = sortEvents(result as any, sortBy);
    setFilteredEvents(result);
  }, [allEvents, selectedOrgs, searchQuery, sortBy]);

  const handleRetry = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const organizationsWithCounts = getOrganizationsWithCounts(allEvents as any);
  const hasFilters = selectedOrgs.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-60 h-60 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <Header eventCount={allEvents.length} />
      
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-10">
            <FeaturedEvents allEvents={allEvents} />

            <div className="bg-white rounded-3xl p-6 shadow-soft border-2 border-slate-100">
              <SearchBar onSearch={setSearchQuery} />
              
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t-2 border-slate-100">
                <FilterBar
                  organizations={organizationsWithCounts}
                  selectedOrgs={selectedOrgs}
                  onFilterChange={setSelectedOrgs}
                />
                
                <SortControls currentSort={sortBy} onSortChange={setSortBy} />
              </div>

              {hasFilters && (
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  Showing <span className="text-brand-orange text-lg">{filteredEvents.length}</span> of{' '}
                  <span className="text-slate-900">{allEvents.length}</span> events
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                showLeaderboard 
                  ? 'bg-slate-200 text-slate-700' 
                  : 'bg-gradient-to-r from-brand-orange to-brand-rose text-white shadow-colored hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {showLeaderboard ? <List className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard 🏆'}
            </button>

            {showLeaderboard && (
              <Leaderboard
                apiEvents={apiEvents}
                submittedEvents={submittedEvents}
                pastEvents={pastEvents}
              />
            )}

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-soft">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    All Events
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Every free food opportunity on campus
                  </p>
                </div>
              </div>
              
              <EventList
                events={filteredEvents as MavEngageEvent[]}
                hasFilters={hasFilters}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="relative mt-20 border-t-2 border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-rose rounded-2xl flex items-center justify-center shadow-colored rotate-3 hover:rotate-6 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center text-xs animate-bounce">
                🍕
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                Mav<span className="text-brand-orange">Munch</span>
              </h3>
              <p className="text-slate-500 font-medium">
                Never miss free food at UTA again!
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue-soft rounded-full">
              <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
              <span className="text-sm font-bold text-brand-blue-dark">
                Made with hunger by ACM @ UTA
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}