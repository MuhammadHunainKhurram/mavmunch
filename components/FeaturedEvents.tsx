'use client';

import { useMemo } from 'react';
import { EventCard } from './EventCard';
import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { Zap, Calendar, Sparkles } from 'lucide-react';

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
    <div className="space-y-8">
      {happeningNow.length > 0 && (
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-orange/5 to-brand-rose/5 rounded-3xl -z-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-rose rounded-2xl flex items-center justify-center shadow-colored animate-pulse-slow">
                <Zap className="w-6 h-6 text-white fill-current" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Happening Now!
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Starting within 2 hours • Don't miss out!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-purple rounded-2xl flex items-center justify-center shadow-soft">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Today @ UTA
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Free food events happening today
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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