'use client';

import { useMemo } from 'react';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { getOrgName } from '@/lib/utils';

interface LeaderboardProps {
  pastEvents: SubmittedEvent[];
}

export function Leaderboard({ pastEvents }: LeaderboardProps) {
  const leaderboardData = useMemo(() => {
    // pastEvents is already limited to the past 6 months by the service
    const stats = new Map<string, number>();

    pastEvents.forEach((event) => {
      const org = getOrgName(event);
      stats.set(org, (stats.get(org) || 0) + 1);
    });

    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([org, count], index) => ({
        rank: index + 1,
        organization: org,
        count,
      }));
  }, [pastEvents]);

  return (
    <div className="bg-white dark:bg-warm-900 rounded-xl shadow-soft border border-slate-200 dark:border-warm-800 overflow-hidden mb-12">
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-warm-800 bg-slate-50/60 dark:bg-warm-900/80">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-warm-50">
            🏆 Leaderboard
          </h2>
          <p className="text-slate-600 dark:text-warm-400 text-sm mt-1">
            Organizations with the most free food events in the past 6 months
          </p>
        </div>
      </div>

      {leaderboardData.length === 0 ? (
        <p className="px-4 sm:px-6 py-8 text-center text-sm text-warm-500 dark:text-warm-400">
          No events in the past 6 months yet. Check back soon!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-warm-900 border-b border-slate-200 dark:border-warm-800">
                <th className="px-3 sm:px-4 py-3 text-left font-semibold text-slate-900 dark:text-warm-100 w-12">Rank</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold text-slate-900 dark:text-warm-100">Organization</th>
                <th className="px-3 sm:px-4 py-3 text-center font-semibold text-slate-900 dark:text-warm-100 w-16">Events</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.rank} className="border-b border-slate-100 dark:border-warm-800 hover:bg-slate-50 dark:hover:bg-warm-800/70 transition-colors">
                  <td className="px-3 sm:px-4 py-3 font-semibold text-slate-900 dark:text-warm-50">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-900 dark:text-warm-100 font-medium">
                    <div className="break-words">{entry.organization}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <span className="inline-block font-bold text-orange-500 dark:text-uta-orange">{entry.count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
