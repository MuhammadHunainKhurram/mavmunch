'use client';

import { useMemo } from 'react';
import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { Zap } from 'lucide-react';

interface FeaturedEventsProps {
  allEvents: (MavEngageEvent | SubmittedEvent)[];
}

function isApiEvent(
  event: MavEngageEvent | SubmittedEvent
): event is MavEngageEvent {
  return 'startsOn' in event;
}

export function FeaturedEvents({
  allEvents,
}: FeaturedEventsProps) {
  const happeningNowCount = useMemo(() => {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return allEvents.filter((event) => {
      let eventStart: Date;
      if (isApiEvent(event)) {
        eventStart = new Date(event.startsOn);
      } else {
        eventStart = new Date(`${event.date}T${event.startTime}`);
      }
      return eventStart >= now && eventStart <= twoHoursLater;
    }).length;
  }, [allEvents]);

  if (happeningNowCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-uta-orange/10 to-uta-blue/10 rounded-2xl border border-uta-orange/20">
      <div className="w-12 h-12 bg-uta-orange rounded-xl flex items-center justify-center shadow-orange shrink-0">
        <Zap className="w-6 h-6 text-white fill-current" />
      </div>
      <div>
        <p className="font-bold text-uta-orange-dark dark:text-uta-orange text-lg">
          {happeningNowCount} event{happeningNowCount !== 1 ? 's' : ''} happening soon!
        </p>
        <p className="text-sm text-uta-blue dark:text-warm-400">
          Starting within the next 2 hours
        </p>
      </div>
    </div>
  );
}