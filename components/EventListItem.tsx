'use client';

import { MavEngageEvent } from '@/lib/types';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { formatDate, formatTime, getMavEngageUrl } from '@/lib/utils';
import { MapPin, Clock, ArrowUpRight, Flame } from 'lucide-react';

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

const colorSchemes = [
  { accent: 'brand-orange', light: 'brand-orange-light', soft: 'brand-orange-soft' },
  { accent: 'brand-blue', light: 'brand-blue-light', soft: 'brand-blue-soft' },
  { accent: 'brand-purple', light: 'brand-purple-light', soft: 'purple-50' },
  { accent: 'brand-teal', light: 'brand-teal-light', soft: 'teal-50' },
  { accent: 'brand-rose', light: 'brand-rose-light', soft: 'rose-50' },
];

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
  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border-2 border-slate-100 hover:border-transparent overflow-hidden card-hover hover:shadow-colored relative"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${colorScheme.accent}`} />
      
      <div className="flex items-stretch">
        <div className={`flex-shrink-0 w-24 sm:w-28 p-4 sm:p-5 flex flex-col justify-center bg-${colorScheme.soft}`}>
          <div className={`text-2xl sm:text-3xl font-black text-${colorScheme.accent} tabular-nums leading-none`}>
            {eventTime.split(' ')[0]}
          </div>
          <div className={`text-sm font-bold text-${colorScheme.accent}/70 mt-1`}>
            {eventTime.split(' ')[1]}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wide">
            {eventDate}
          </div>
          
          {isUrgent && (
            <div className={`mt-3 inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg shadow-subtle`}>
              <Flame className="w-3 h-3 text-brand-orange" />
              <span className="text-xs font-bold text-brand-orange">
                {hoursUntil === 0 ? 'NOW' : `${hoursUntil}h`}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 bg-${colorScheme.light} text-${colorScheme.accent} text-xs font-bold uppercase tracking-wider rounded-full`}>
                  {eventOrg}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-rose text-white text-xs font-bold rounded-full shadow-sm">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  FREE FOOD
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-2 mb-3 leading-tight">
                {eventName}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <div className={`w-8 h-8 rounded-lg bg-${colorScheme.light} flex items-center justify-center flex-shrink-0`}>
                  <MapPin className={`w-4 h-4 text-${colorScheme.accent}`} />
                </div>
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <div className={`hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-${colorScheme.light} text-${colorScheme.accent} group-hover:bg-${colorScheme.accent} group-hover:text-white transition-all duration-300 flex-shrink-0`}>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}