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

const gradients = [
  'from-brand-orange to-brand-rose',
  'from-brand-blue to-brand-purple',
  'from-brand-teal to-brand-blue',
  'from-brand-purple to-brand-rose',
  'from-brand-orange to-brand-yellow',
];

export function EventCard({ event, featured = false, colorIndex = 0 }: EventCardProps) {
  const eventName = getEventName(event);
  const eventOrg = event.organizationName;
  const eventDate = getEventDate(event);
  const eventTime = getEventTime(event);
  const eventUrl = isApiEvent(event)
    ? getMavEngageUrl(event.id)
    : `https://mavorgs.campuslabs.com/engage/event/${event.id || ''}`;

  const gradient = gradients[colorIndex % gradients.length];

  return (
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-white rounded-2xl border-2 ${featured ? 'border-transparent' : 'border-slate-100'} overflow-hidden card-hover relative`}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      
      {featured && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur text-brand-orange text-xs font-bold rounded-full shadow-sm">
            <Zap className="w-3 h-3 fill-current" />
            LIVE
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="mb-3">
          <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${gradient} bg-opacity-10 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full`} style={{ background: `linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(244, 63, 94, 0.1))` }}>
            {eventOrg}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-2 mb-4 leading-tight min-h-[3.5rem]">
          {eventName}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-orange-light flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
              <div className="font-bold text-slate-900">{eventDate}</div>
              <div className="text-slate-500 font-medium">{eventTime}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-blue-light flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-brand-blue" />
            </div>
            <span className="text-slate-600 font-medium leading-relaxed pt-2">{event.location}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-lg shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Free Food
          </span>
          
          <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 group-hover:text-brand-orange transition-colors">
            View
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}