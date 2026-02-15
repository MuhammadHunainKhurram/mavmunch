'use client';

import { useMemo } from 'react';
import { EventCard } from './EventCard';
import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { Zap, Calendar } from 'lucide-react';

interface FeaturedEventsProps {
  allEvents: (MavEngageEvent | SubmittedEvent)[];
}

function isApiEvent(
  event: MavEngageEvent | SubmittedEvent
): event is MavEngageEvent {
  return 'startsOn' in event;
}

function isSubmittedEvent(
  event: MavEngageEvent | SubmittedEvent
): event is SubmittedEvent {
  return 'date' in event;
}

export function FeaturedEvents({
  allEvents,
}: FeaturedEventsProps) {
  const { happeningNow, todayEvents } = useMemo(() => {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const today = new Date().toISOString().split('T')[0];

    const happeningNow = allEvents
      .filter((event) => {
        let eventStart: Date;
        if (isApiEvent(event)) {
          eventStart = new Date(event.startsOn);
        } else if (isSubmittedEvent(event)) {
          eventStart = new Date(`${event.date}T${event.startTime}`);
        } else {
          return false;
        }
        return eventStart >= now && eventStart <= twoHoursLater;
      })
      .slice(0, 3);

    const todayEvents = allEvents
      .filter((event) => {
        let eventDate: string;
        if (isApiEvent(event)) {
          eventDate = event.startsOn.split('T')[0];
        } else if (isSubmittedEvent(event)) {
          eventDate = event.date;
        } else {
          return false;
        }
        const isHappening = happeningNow.some((h) => {
          if (isApiEvent(h) && isApiEvent(event)) {
            return h.id === event.id;
          }
          if (isSubmittedEvent(h) && isSubmittedEvent(event)) {
            return h.id === event.id;
          }
          return false;
        });
        return eventDate === today && !isHappening;
      })
      .slice(0, 3);

    return { happeningNow, todayEvents };
  }, [allEvents]);

  if (happeningNow.length === 0 && todayEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {happeningNow.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-campus-orange rounded-xl flex items-center justify-center shadow-warm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="section-heading text-xl sm:text-2xl">
                Happening Now
              </h2>
              <p className="section-subheading">
                Starting within 2 hours
              </p>
            </div>
            <span className="ml-auto relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-campus-orange"></span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {happeningNow.map((event, index) => {
              const eventId = isApiEvent(event) ? event.id : event.id;
              return (
                <EventCard
                  key={eventId || index}
                  event={event as MavEngageEvent}
                  featured={true}
                  colorIndex={index}
                />
              );
            })}
          </div>
        </section>
      )}

      {todayEvents.length > 0 && happeningNow.length === 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-campus-blue rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="section-heading text-xl sm:text-2xl">
                Today on Campus
              </h2>
              <p className="section-subheading">
                Free food events happening today
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {todayEvents.map((event, index) => {
              const eventId = isApiEvent(event) ? event.id : event.id;
              return (
                <EventCard
                  key={eventId || index}
                  event={event as MavEngageEvent}
                  colorIndex={index + 2}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
