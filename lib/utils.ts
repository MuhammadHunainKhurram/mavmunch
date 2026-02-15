import { MavEngageEvent, SortOption } from './types';

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
  events: MavEngageEvent[]
): { org: string; count: number }[] {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const org = event.organizationName;
    counts.set(org, (counts.get(org) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([org, count]) => ({ org, count }))
    .sort((a, b) => a.org.localeCompare(b.org));
}

export function sortEvents(
  events: MavEngageEvent[],
  sortBy: SortOption
): MavEngageEvent[] {
  const sorted = [...events];

  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) =>
        new Date(a.startsOn).getTime() - new Date(b.startsOn).getTime()
      );
    case 'date-desc':
      return sorted.sort((a, b) =>
        new Date(b.startsOn).getTime() - new Date(a.startsOn).getTime()
      );
    case 'org-asc':
      return sorted.sort((a, b) =>
        a.organizationName.localeCompare(b.organizationName)
      );
    case 'name-asc':
      return sorted.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    default:
      return sorted;
  }
}

export function filterByOrganizations(
  events: MavEngageEvent[],
  selectedOrgs: string[]
): MavEngageEvent[] {
  if (selectedOrgs.length === 0) return events;
  return events.filter((e) => selectedOrgs.includes(e.organizationName));
}

export function getMavEngageUrl(eventId: string): string {
  return `https://mavorgs.campuslabs.com/engage/event/${eventId}`;
}
