'use client';

import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { formatDate, formatTime, getMavEngageUrl } from '@/lib/utils';
import { MapPin, ArrowUpRight, Clock, Calendar } from 'lucide-react';

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

function getDaysUntil(event: EventType): string {
  const start = getStartDateTime(event);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  
  const diffTime = eventDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return 'Past';
  return `In ${diffDays} days`;
}

interface EventCardProps {
  event: EventType;
  featured?: boolean;
  index?: number;
}

export function EventCard({ event, featured = false, index = 0 }: EventCardProps) {
  const eventName = getEventName(event);
  const eventOrg = event.organizationName;
  const eventDate = getEventDate(event);
  const eventTime = getEventTime(event);
  const daysUntil = getDaysUntil(event);
  const eventUrl = isApiEvent(event)
    ? getMavEngageUrl(event.id)
    : `https://mavorgs.campuslabs.com/engage/event/${event.id || ''}`;

  const isOrange = index % 2 === 0;

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-modern overflow-hidden hover:shadow-medium transition-all duration-300"
    >
      <div className="flex items-stretch">
        {/* Left accent bar */}
        <div className={`flex-shrink-0 w-3 sm:w-4 ${
          isOrange 
            ? 'bg-gradient-to-b from-uta-orange to-uta-orange-dark' 
            : 'bg-gradient-to-b from-uta-blue to-uta-blue-dark'
        }`} />

        {/* Content - More compact */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Organization - matches bar color */}
              <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isOrange ? 'text-uta-orange' : 'text-uta-blue'
              }`}>
                {eventOrg}
              </p>

              {/* Title - hover matches bar color */}
              <h3 className={`text-base sm:text-lg font-bold text-warm-900 dark:text-warm-100 transition-colors line-clamp-2 mb-2 leading-snug ${
                isOrange ? 'group-hover:text-uta-orange' : 'group-hover:text-uta-blue'
              }`}>
                {eventName}
              </h3>

              {/* Meta row - compact */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold text-xs ${
                  isOrange 
                    ? 'bg-uta-orange/10 text-uta-orange-dark' 
                    : 'bg-uta-blue/10 text-uta-blue'
                }`}>
                  <Clock className="w-3 h-3" />
                  {eventTime}
                </span>
                
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold text-xs bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-400">
                  <Calendar className="w-3 h-3" />
                  {eventDate}
                </span>

                {/* Days until badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-lg font-bold text-xs text-white ${
                  daysUntil === 'Today' 
                    ? 'bg-uta-orange' 
                    : daysUntil === 'Tomorrow'
                    ? 'bg-uta-blue'
                    : 'bg-warm-500'
                }`}>
                  {daysUntil}
                </span>
              </div>

              {/* Location - icon matches bar color */}
              <div className="flex items-center gap-2 mt-2 text-sm text-warm-500 dark:text-warm-400">
                <MapPin className={`w-4 h-4 flex-shrink-0 ${isOrange ? 'text-uta-orange' : 'text-uta-blue'}`} />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Arrow - matches bar color */}
            <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-all duration-300 ${
              isOrange
                ? 'bg-uta-orange/10 text-uta-orange group-hover:bg-uta-orange group-hover:text-white'
                : 'bg-uta-blue/10 text-uta-blue group-hover:bg-uta-blue group-hover:text-white'
            }`}>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}