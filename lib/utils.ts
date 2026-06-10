import { MavEngageEvent, SortOption } from './types';
import { SubmittedEvent } from './firebaseTypes';

type AnyEvent = MavEngageEvent | SubmittedEvent;

export function getOrgName(event: {
  organizationName?: string;
  departmentName?: string;
}): string {
  return event.organizationName || event.departmentName || 'University Event';
}

function getEventName(event: AnyEvent): string {
  return 'startsOn' in event ? event.name : event.title;
}

function getStartTime(event: AnyEvent): number {
  const iso =
    'startsOn' in event ? event.startsOn : `${event.date}T${event.startTime}`;
  return new Date(iso).getTime();
}

export function formatEventDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getOrganizationsWithCounts(
  events: AnyEvent[]
): { org: string; count: number }[] {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const org = getOrgName(event);
    counts.set(org, (counts.get(org) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([org, count]) => ({ org, count }))
    .sort((a, b) => a.org.localeCompare(b.org));
}

export function sortEvents(
  events: AnyEvent[],
  sortBy: SortOption
): AnyEvent[] {
  const sorted = [...events];

  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => getStartTime(a) - getStartTime(b));
    case 'date-desc':
      return sorted.sort((a, b) => getStartTime(b) - getStartTime(a));
    case 'org-asc':
      return sorted.sort((a, b) =>
        getOrgName(a).localeCompare(getOrgName(b))
      );
    case 'name-asc':
      return sorted.sort((a, b) =>
        getEventName(a).localeCompare(getEventName(b))
      );
    default:
      return sorted;
  }
}

export function filterByOrganizations(
  events: AnyEvent[],
  selectedOrgs: string[]
): AnyEvent[] {
  if (selectedOrgs.length === 0) return events;
  return events.filter((e) => selectedOrgs.includes(getOrgName(e)));
}

export function getMavEngageUrl(eventId: string): string {
  return `https://mavorgs.campuslabs.com/engage/event/${eventId}`;
}
