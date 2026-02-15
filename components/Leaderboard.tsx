'use client';

import { useState, useMemo } from 'react';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { MavEngageEvent } from '@/lib/types';
import { Trophy, Crown, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  apiEvents: MavEngageEvent[];
  submittedEvents: SubmittedEvent[];
  pastEvents: SubmittedEvent[];
}

const rankIcons = [Crown, Medal, Award];

export function Leaderboard({
  apiEvents,
  submittedEvents,
  pastEvents,
}: LeaderboardProps) {
  const [showPast, setShowPast] = useState(false);

  const leaderboardData = useMemo(() => {
    const eventsToUse = showPast ? pastEvents : submittedEvents;
    const stats = new Map<string, { count: number }>();

    apiEvents.forEach((event) => {
      const org = event.organizationName;
      if (!stats.has(org)) {
        stats.set(org, { count: 0 });
      }
      const current = stats.get(org)!;
      stats.set(org, { count: current.count + 1 });
    });

    eventsToUse.forEach((event) => {
      const org = event.organizationName || 'Other';
      if (!stats.has(org)) {
        stats.set(org, { count: 0 });
      }
      const current = stats.get(org)!;
      stats.set(org, { count: current.count + 1 });
    });

    return Array.from(stats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([org, stat], index) => ({
        rank: index + 1,
        organization: org,
        ...stat,
      }));
  }, [apiEvents, submittedEvents, pastEvents, showPast]);

  return (
    <div className="card-campus overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-warm-200 dark:border-warm-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-campus-amber rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-warm-900 dark:text-warm-100">
              Most Active Orgs
            </h3>
            <p className="text-sm text-warm-500 dark:text-warm-400">
              {showPast ? 'All-time contributors' : 'Currently most active'}
            </p>
          </div>
        </div>

        <div className="flex bg-warm-100 dark:bg-warm-800 rounded-lg p-0.5">
          <button
            onClick={() => setShowPast(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange ${
              !showPast
                ? 'bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 shadow-subtle'
                : 'text-warm-500 dark:text-warm-400'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-orange ${
              showPast
                ? 'bg-white dark:bg-warm-700 text-warm-900 dark:text-warm-100 shadow-subtle'
                : 'text-warm-500 dark:text-warm-400'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="divide-y divide-warm-100 dark:divide-warm-800">
        {leaderboardData.map((entry) => {
          const RankIcon = entry.rank <= 3 ? rankIcons[entry.rank - 1] : null;
          const rankColors = [
            'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            'bg-warm-200 dark:bg-warm-700 text-warm-500 dark:text-warm-400',
            'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
          ];

          return (
            <div
              key={entry.rank}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-warm-50 dark:hover:bg-warm-800/50 transition-colors"
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm ${
                entry.rank <= 3
                  ? rankColors[entry.rank - 1]
                  : 'bg-warm-100 dark:bg-warm-800 text-warm-400 dark:text-warm-500'
              }`}>
                {RankIcon ? (
                  <RankIcon className="w-4 h-4" />
                ) : (
                  entry.rank
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  entry.rank <= 3
                    ? 'text-warm-900 dark:text-warm-100'
                    : 'text-warm-700 dark:text-warm-300'
                }`}>
                  {entry.organization}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-bold tabular-nums ${
                  entry.rank <= 3 ? 'text-campus-orange' : 'text-warm-400 dark:text-warm-500'
                }`}>
                  {entry.count}
                </span>
                <span className="text-xs text-warm-400 dark:text-warm-500">events</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
