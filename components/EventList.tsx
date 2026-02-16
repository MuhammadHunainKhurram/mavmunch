'use client';

import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { EventCard } from './EventCard';
import { EmptyState } from './EmptyState';
import { isToday, isTomorrow, isThisWeek, isThisMonth, parseISO } from '@/lib/dateUtils';
import { SortOption } from '@/lib/types';

type AnyEvent = MavEngageEvent | SubmittedEvent;

interface EventListProps {
  events: AnyEvent[];
  hasFilters: boolean;
  sortBy: SortOption;
}

interface GroupedEvents {
  today: AnyEvent[];
  tomorrow: AnyEvent[];
  thisWeek: AnyEvent[];
  thisMonth: AnyEvent[];
  later: AnyEvent[];
}

function getEventDate(event: AnyEvent): Date {
  if ('startsOn' in event) {
    return parseISO(event.startsOn);
  }
  return parseISO(`${event.date}T${event.startTime}`);
}

function groupEventsByTime(events: AnyEvent[]): GroupedEvents {
  const grouped: GroupedEvents = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    thisMonth: [],
    later: [],
  };

  events.forEach((event) => {
    const date = getEventDate(event);
    
    if (isToday(date)) {
      grouped.today.push(event);
    } else if (isTomorrow(date)) {
      grouped.tomorrow.push(event);
    } else if (isThisWeek(date)) {
      grouped.thisWeek.push(event);
    } else if (isThisMonth(date)) {
      grouped.thisMonth.push(event);
    } else {
      grouped.later.push(event);
    }
  });

  return grouped;
}

const groupConfig = {
  today: { 
    label: 'Today', 
    color: 'bg-uta-blue',
    badgeColor: 'bg-warm-600 text-white'
  },
  tomorrow: { 
    label: 'Tomorrow', 
    color: 'bg-uta-blue',
    badgeColor: 'bg-warm-600 text-white'
  },
  thisWeek: { 
    label: 'This Week', 
    color: 'bg-uta-blue',
    badgeColor: 'bg-warm-600 text-white'
  },
  thisMonth: { 
    label: 'This Month', 
    color: 'bg-uta-blue',
    badgeColor: 'bg-warm-600 text-white'
  },
  later: { 
    label: 'Later', 
    color: 'bg-uta-blue',
    badgeColor: 'bg-warm-600 text-white'
  },
};

export function EventList({ events, hasFilters, sortBy }: EventListProps) {
  if (events.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  const isSortedByDate = sortBy === 'date-asc';
  
  if (!isSortedByDate) {
    return (
      <div className="space-y-4">
        {events.map((event, index) => (
          <EventCard 
            key={event.id || index} 
            event={event} 
            index={index}
          />
        ))}
      </div>
    );
  }

  const grouped = groupEventsByTime(events);

  return (
    <div className="space-y-8">
      {(Object.keys(grouped) as Array<keyof GroupedEvents>).map((key) => {
        const groupEvents = grouped[key];
        if (groupEvents.length === 0) return null;

        const config = groupConfig[key];

        return (
          <section key={key} className="animate-slide-up">
            <div className="flex items-center gap-4 mb-4 top-20 bg-cream/95 rounded-lg dark:bg-cream-dark/95 py-2">
              <div className={`ml-2 w-4 h-1 ${config.color} rounded-full`} />
              <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">{config.label}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${config.badgeColor}`}>{groupEvents.length}</span>
              <div className="flex-1 h-px bg-warm-200 dark:border-warm-800" />
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {groupEvents.map((event, index) => (
                <EventCard 
                  key={event.id || index} 
                  event={event} 
                  featured={key === 'today' && index === 0}
                  index={index}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}