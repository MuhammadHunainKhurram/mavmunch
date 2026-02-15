'use client';

import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { formatDate, formatTime, getMavEngageUrl } from '@/lib/utils';
import { MapPin, Clock, Zap } from 'lucide-react';

type EventType = MavEngageEvent | SubmittedEvent;

function isApiEvent(event: EventType): event is MavEngageEvent {
  return 'startsOn' in event;
}

function getEventName(event: EventType): string {
  return isApiEvent(event) ? event.name : event.title;
}

function getEventTime(event: EventType): string {
  if (isApiEvent(event)) {
    return formatTime(event.startsOn);
  }
  return event.startTime;
}

function getEventDate(event: EventType): string {
  if (isApiEvent(event)) {
    return formatDate(event.startsOn);
  }
  return formatDate(`${event.date}T${event.startTime}`);
}

interface EventCardProps {
  event: EventType;
  featured?: boolean;
  colorIndex?: number;
}

const stickyColors = [
  'sticky-yellow',
  'sticky-orange',
  'sticky-pink',
  'sticky-blue',
  'sticky-green',
  'sticky-purple',
];

const stickyRotations = [
  'rotate-[-1.5deg]',
  'rotate-[1deg]',
  'rotate-[-0.5deg]',
  'rotate-[1.5deg]',
  'rotate-[-1deg]',
  'rotate-[0.5deg]',
];

export function EventCard({ event, featured = false, colorIndex = 0 }: EventCardProps) {
  const eventName = getEventName(event);
  const eventOrg = event.organizationName;
  const eventDate = getEventDate(event);
  const eventTime = getEventTime(event);
  const eventUrl = isApiEvent(event)
    ? getMavEngageUrl(event.id)
    : `https://mavorgs.campuslabs.com/engage/event/${event.id || ''}`;

  const color = stickyColors[colorIndex % stickyColors.length];
  const rotation = stickyRotations[colorIndex % stickyRotations.length];

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block sticky-note ${color} ${rotation} tape-strip mt-4 overflow-hidden`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wide text-warm-600 dark:text-warm-300 opacity-70">
            {eventOrg}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-campus-orange">
              <Zap className="w-3 h-3" />
              Live
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100 group-hover:text-campus-orange transition-colors line-clamp-2 mb-4 leading-snug">
          {eventName}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-warm-700 dark:text-warm-300">
            <Clock className="w-4 h-4 text-warm-500 dark:text-warm-400 flex-shrink-0" />
            <span className="font-medium">{eventDate} &middot; {eventTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-warm-700 dark:text-warm-300">
            <MapPin className="w-4 h-4 text-warm-500 dark:text-warm-400 flex-shrink-0" />
            <span className="font-medium truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-warm-900/10 dark:border-warm-100/10 flex items-center justify-end">
          <span className="text-xs font-semibold text-warm-500 dark:text-warm-400 group-hover:text-campus-orange transition-colors flex items-center gap-1">
            View details
            <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
