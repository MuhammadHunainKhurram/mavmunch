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
import { DisclaimerModal } from '@/components/DisclaimerModal';
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
import { Trophy, ChevronDown, Calendar, X } from 'lucide-react';

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

      const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
        Promise.race([
          promise,
          new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
        ]);

      const [api, submitted, past] = await Promise.all([
        withTimeout(getFreeFoodEvents(60), 10000, []),
        withTimeout(getApprovedSubmittedEvents(60), 10000, []),
        withTimeout(getPastSubmittedEvents(12), 10000, []),
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
        const org = event.organizationName ?? '';
        const location = event.location ?? '';
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

  const handleRemoveOrg = (org: string) => {
    setSelectedOrgs(selectedOrgs.filter((o) => o !== org));
  };

  const organizationsWithCounts = getOrganizationsWithCounts(allEvents as any);
  const hasFilters = selectedOrgs.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen relative">
      <DisclaimerModal />
      <Header eventCount={allEvents.length} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-8">
            <FeaturedEvents allEvents={allEvents} />

            <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-5 sm:p-6 space-y-5 overflow-visible">
              <SearchBar onSearch={setSearchQuery} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-warm-200 dark:border-warm-800">
                <FilterBar
                  organizations={organizationsWithCounts}
                  selectedOrgs={selectedOrgs}
                  onFilterChange={setSelectedOrgs}
                />

                <SortControls currentSort={sortBy} onSortChange={setSortBy} />
              </div>

              {hasFilters && (
                <p className="text-sm text-warm-500 dark:text-warm-400 pt-2">
                  Showing <span className="font-bold text-uta-orange">{filteredEvents.length}</span> of{' '}
                  <span className="font-bold text-warm-900 dark:text-warm-100">{allEvents.length}</span> events
                </p>
              )}

              {selectedOrgs.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedOrgs.map((org) => (
                    <span
                      key={org}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-uta-orange/10 text-uta-orange-dark dark:bg-uta-orange/20 dark:text-uta-orange text-sm font-semibold rounded-xl max-w-[300px]"
                    >
                      <span className="leading-tight" style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        {org}
                      </span>
                      <button
                        onClick={() => handleRemoveOrg(org)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-uta-orange/20 transition-colors flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                showLeaderboard
                  ? 'bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300'
                  : 'bg-uta-orange text-white shadow-orange hover:bg-uta-orange-dark'
              }`}
            >
              <Trophy className="w-4 h-4" />
              {showLeaderboard ? 'Hide leaderboard' : 'View leaderboard'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLeaderboard ? 'rotate-180' : ''}`} />
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
                <div className="w-10 h-10 bg-uta-blue rounded-xl flex items-center justify-center shadow-blue">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-warm-900 dark:text-warm-100">
                    All Events
                  </h2>
                </div>
              </div>

              <EventList
                events={filteredEvents}
                hasFilters={hasFilters}
                sortBy={sortBy}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="relative z-10 mt-20 border-t border-warm-200 dark:border-warm-800 bg-white/50 dark:bg-warm-950/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-uta-orange rounded-xl flex items-center justify-center shadow-orange">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-warm-900 dark:text-warm-100">
                Mav<span className="text-uta-orange">Munch</span>
              </h3>
            </div>

            <p className="text-sm text-warm-500 dark:text-warm-400 max-w-sm">
              Never miss free food at UTA again. <br></br>Made with care by ACM @ UTA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}