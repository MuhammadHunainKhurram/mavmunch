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

  // Alternate between orange and blue accents
  const isOrange = index % 2 === 0;

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-uta-hover"
    >
      <div className="flex items-stretch">
        {/* Time column */}
        <div className={`flex-shrink-0 w-24 sm:w-28 p-4 sm:p-5 flex flex-col justify-center border-r border-warm-200 dark:border-warm-800 ${
          isOrange ? 'bg-uta-orange-light dark:bg-uta-orange/5' : 'bg-uta-blue-light dark:bg-uta-blue/5'
        }`}>
          <div className={`text-2xl font-black tabular-nums leading-none ${
            isOrange ? 'text-uta-orange' : 'text-uta-blue'
          }`}>
            {eventTime.split(' ')[0]}
          </div>
          <div className={`text-sm font-bold mt-1 ${
            isOrange ? 'text-uta-orange/70' : 'text-uta-blue/70'
          }`}>
            {eventTime.split(' ')[1]}
          </div>
          <div className="text-xs font-semibold text-warm-500 mt-2 uppercase tracking-wide">
            {eventDate}
          </div>
          
          {isUrgent && (
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-warm-800 rounded-lg shadow-sm">
              <Flame className="w-3 h-3 text-uta-orange" />
              <span className="text-xs font-bold text-uta-orange">
                {hoursUntil === 0 ? 'NOW' : `${hoursUntil}h`}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Meta */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isOrange ? 'text-uta-blue' : 'text-uta-orange'
                }`}>
                  {eventOrg}
                </span>
                <span className="chip-uta text-xs">
                  Free Food
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-warm-900 dark:text-warm-100 group-hover:text-uta-orange transition-colors line-clamp-2 mb-2 leading-snug">
                {eventName}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-warm-500 dark:text-warm-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-800 text-warm-400 group-hover:bg-uta-orange group-hover:text-white transition-all flex-shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}