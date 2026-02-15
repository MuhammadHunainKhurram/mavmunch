'use client';

import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { formatDate, formatTime, getMavEngageUrl } from '@/lib/utils';
import { MapPin, ArrowUpRight, Flame, Clock } from 'lucide-react';

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

function getStartDateTime(event: EventType): Date {
  if (isApiEvent(event)) {
    return new Date(event.startsOn);
  }
  return new Date(`${event.date}T${event.startTime}`);
}

interface EventListItemProps {
  event: EventType;
  index?: number;
}

const listStickyColors = [
  'sticky-yellow',
  'sticky-blue',
  'sticky-green',
  'sticky-orange',
  'sticky-pink',
  'sticky-purple',
];

export function EventListItem({ event, index = 0 }: EventListItemProps) {
  const eventName = getEventName(event);
  const eventOrg = event.organizationName;
  const eventDate = getEventDate(event);
  const eventTime = getEventTime(event);
  const eventUrl = isApiEvent(event)
    ? getMavEngageUrl(event.id)
    : `https://mavorgs.campuslabs.com/engage/event/${event.id || ''}`;

  const startDateTime = getStartDateTime(event);
  const now = new Date();
  const isUpcoming = startDateTime > now;
  const hoursUntil = Math.floor((startDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = isUpcoming && hoursUntil >= 0 && hoursUntil <= 24;

  const color = listStickyColors[index % listStickyColors.length];

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block sticky-note ${color} overflow-hidden`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wide text-warm-600 dark:text-warm-300 opacity-70">
                {eventOrg}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-campus-orange">
                  <Flame className="w-3 h-3" />
                  {hoursUntil === 0 ? 'Now' : `${hoursUntil}h away`}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-warm-900 dark:text-warm-100 group-hover:text-campus-orange transition-colors line-clamp-2 mb-2.5 leading-snug">
              {eventName}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-600 dark:text-warm-400">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {eventDate} &middot; {eventTime}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px] sm:max-w-none">{event.location}</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-warm-400 dark:text-warm-500 group-hover:text-campus-orange transition-colors flex-shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </a>
  );
}
