'use client';

import { MavEngageEvent } from '@/lib/types';
import { EventListItem } from './EventListItem';
import { EmptyState } from './EmptyState';

interface EventListProps {
  events: MavEngageEvent[];
  hasFilters: boolean;
}

export function EventList({ events, hasFilters }: EventListProps) {
  if (events.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div
          key={event.id}
          style={{
            animation: `slideUp 0.4s ease-out ${index * 30}ms both`,
          }}
        >
          <EventListItem event={event as any} index={index} />
        </div>
      ))}
    </div>
  );
}
