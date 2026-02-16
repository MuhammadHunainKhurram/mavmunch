'use client';

import { useMemo } from 'react';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { MavEngageEvent } from '@/lib/types';

interface LeaderboardProps {
  apiEvents: MavEngageEvent[];
  submittedEvents: SubmittedEvent[];
  pastEvents: SubmittedEvent[];
}

export function Leaderboard({
  apiEvents,
  submittedEvents,
}: LeaderboardProps) {
  const leaderboardData = useMemo(() => {
    const stats = new Map<string, { count: number }>();
    const now = new Date();

    // Only include future API events
    apiEvents.forEach((event) => {
      const eventDate = new Date(event.startsOn);
      if (eventDate > now) {
        const org = event.organizationName;
        if (!stats.has(org)) {
          stats.set(org, { count: 0 });
        }
        const current = stats.get(org)!;
        stats.set(org, { count: current.count + 1 });
      }
    });

    // Include future submitted events
    submittedEvents.forEach((event) => {
      const eventDate = new Date(`${event.date}T${event.startTime}`);
      if (eventDate > now) {
        const org = event.organizationName || 'Other';
        if (!stats.has(org)) {
          stats.set(org, { count: 0 });
        }
        const current = stats.get(org)!;
        stats.set(org, { count: current.count + 1 });
      }
    });

    return Array.from(stats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15)
      .map(([org, stat], index) => ({
        rank: index + 1,
        organization: org,
        ...stat,
      }));
  }, [apiEvents, submittedEvents]);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-200 overflow-hidden mb-12">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            🏆 Leaderboard
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Organizations with the most upcoming free food events
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3 sm:px-4 py-3 text-left font-semibold text-slate-900 w-12">
                Rank
              </th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold text-slate-900">
                Organization
              </th>
              <th className="px-3 sm:px-4 py-3 text-center font-semibold text-slate-900 w-16">
                Events
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry) => (
              <tr
                key={entry.rank}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 sm:px-4 py-3 font-semibold text-slate-900">
                  {entry.rank === 1
                    ? '🥇'
                    : entry.rank === 2
                      ? '🥈'
                      : entry.rank === 3
                        ? '🥉'
                        : `#${entry.rank}`}
                </td>
                <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium">
                  <div className="break-words">{entry.organization}</div>
                </td>
                <td className="px-3 sm:px-4 py-3 text-center">
                  <span className="inline-block font-bold text-orange-500">
                    {entry.count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}