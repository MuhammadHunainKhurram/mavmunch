'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getApprovedDfwEvents } from '@/lib/firebaseService';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { SearchBar } from '@/components/SearchBar';
import { EventCard } from '@/components/EventCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ArrowLeft, ArrowDownUp, MapPin } from 'lucide-react';

export default function DfwPage() {
  const [events, setEvents] = useState<SubmittedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [soonestFirst, setSoonestFirst] = useState(true);

  useEffect(() => {
    getApprovedDfwEvents(60).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, []);

  const visibleEvents = useMemo(() => {
    let result = events;
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.organizationName ?? '').toLowerCase().includes(query) ||
          (event.location ?? '').toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    return [...result].sort((a, b) => {
      const diff =
        new Date(`${a.date}T${a.startTime}`).getTime() -
        new Date(`${b.date}T${b.startTime}`).getTime();
      return soonestFirst ? diff : -diff;
    });
  }, [events, searchQuery, soonestFirst]);

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-500 dark:text-warm-400 hover:text-uta-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to UTA events
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-uta-blue rounded-xl flex items-center justify-center shadow-blue">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 dark:text-warm-100">
            DFW Food Events
          </h1>
        </div>
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
          Community food events across Dallas–Fort Worth, within 50 miles of
          UTA, both free and paid.
        </p>

        <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-5 sm:p-6 space-y-4 mb-8">
          <SearchBar
            value={searchQuery}
            onSearch={setSearchQuery}
            placeholder="Search events, hosts, locations..."
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-warm-500 dark:text-warm-400">
              <span className="font-bold text-uta-orange">{visibleEvents.length}</span>{' '}
              event{visibleEvents.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setSoonestFirst(!soonestFirst)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" />
              {soonestFirst ? 'Soonest first' : 'Latest first'}
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : visibleEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-2">
              {searchQuery ? 'No matches found' : 'No DFW events yet'}
            </p>
            <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
              {searchQuery
                ? 'Try a different search.'
                : 'Know about a food event in the area? Be the first to share it.'}
            </p>
            <Link href="/submit" className="btn-primary inline-block">
              Submit an event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleEvents.map((event, index) => (
              <EventCard key={event.id || index} event={event} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
