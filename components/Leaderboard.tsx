'use client';

import { useState, useMemo } from 'react';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { MavEngageEvent } from '@/lib/types';
import { Trophy, Clock, History, Crown, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  apiEvents: MavEngageEvent[];
  submittedEvents: SubmittedEvent[];
  pastEvents: SubmittedEvent[];
}

const rankStyles = [
  { bg: 'from-yellow-400 to-amber-500', text: 'text-amber-600', icon: Crown, label: '1st' },
  { bg: 'from-slate-300 to-slate-400', text: 'text-slate-500', icon: Medal, label: '2nd' },
  { bg: 'from-amber-600 to-amber-700', text: 'text-amber-700', icon: Award, label: '3rd' },
];

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
    <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-soft">
      <div className="flex items-center justify-between p-5 border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-colored">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Top Feeders</h3>
            <p className="text-sm font-semibold text-slate-500">
              {showPast ? 'All time champs' : 'Most active now'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPast(!showPast)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            showPast 
              ? 'bg-brand-blue text-white shadow-soft' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showPast ? <Clock className="w-4 h-4" /> : <History className="w-4 h-4" />}
          <span>{showPast ? 'Current' : 'All Time'}</span>
        </button>
      </div>

      <div className="divide-y-2 divide-slate-100">
        {leaderboardData.map((entry) => {
          const rankStyle = rankStyles[entry.rank - 1] || null;
          const RankIcon = rankStyle?.icon || null;
          
          return (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                entry.rank <= 3 ? 'bg-gradient-to-r from-slate-50/50 to-transparent' : 'hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${
                entry.rank <= 3 
                  ? `bg-gradient-to-br ${rankStyle?.bg} text-white shadow-soft` 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {entry.rank <= 3 && RankIcon ? (
                  <RankIcon className="w-5 h-5" />
                ) : (
                  entry.rank
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${
                  entry.rank === 1 ? 'text-lg text-amber-600' : 
                  entry.rank === 2 ? 'text-slate-700' : 
                  entry.rank === 3 ? 'text-amber-700' : 'text-slate-700'
                }`}>
                  {entry.organization}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${
                  entry.rank <= 3 ? 'text-brand-orange' : 'text-slate-400'
                }`}>
                  {entry.count}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">events</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}