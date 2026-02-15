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
import { Trophy, ChevronDown, Utensils } from 'lucide-react';

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

      // Wrap each call with a timeout so hanging Firebase calls don't block forever
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

  const organizationsWithCounts = getOrganizationsWithCounts(allEvents as any);
  const hasFilters = selectedOrgs.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen ruled-paper">
      <Header eventCount={allEvents.length} />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-10">
            <FeaturedEvents allEvents={allEvents} />

            {/* Search + Filter + Sort — notebook style */}
            <div className="sticky-note sticky-yellow p-5 sm:p-6 space-y-5">
              <SearchBar onSearch={setSearchQuery} />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-warm-200 dark:border-warm-800">
                <FilterBar
                  organizations={organizationsWithCounts}
                  selectedOrgs={selectedOrgs}
                  onFilterChange={setSelectedOrgs}
                />

                <SortControls currentSort={sortBy} onSortChange={setSortBy} />
              </div>

              {hasFilters && (
                <p className="text-sm text-warm-500 dark:text-warm-400">
                  Showing <span className="font-semibold text-campus-orange">{filteredEvents.length}</span> of{' '}
                  <span className="font-semibold text-warm-900 dark:text-warm-100">{allEvents.length}</span> events
                </p>
              )}
            </div>

            {/* Leaderboard toggle */}
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-warm-950 ${
                showLeaderboard
                  ? 'btn-secondary'
                  : 'btn-primary'
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

            {/* All Events */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-warm-900 dark:bg-warm-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white dark:text-warm-900" />
                </div>
                <div>
                  <h2 className="section-heading text-xl sm:text-2xl">
                    Upcoming Free Food
                  </h2>
                  <p className="section-subheading">
                    Don&apos;t miss out on these
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

      <footer className="relative mt-16 border-t border-warm-300/50 dark:border-warm-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-campus-orange rounded-lg flex items-center justify-center">
                <span className="text-lg" role="img" aria-label="pizza">🍕</span>
              </div>
              <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
                Mav<span className="text-campus-orange">Munch</span>
              </h3>
            </div>

            <p className="text-sm text-warm-500 dark:text-warm-400 max-w-xs">
              Never miss free food at UTA again.
            </p>

            <p className="text-xs text-warm-400 dark:text-warm-500">
              Made with hunger by ACM @ UTA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
