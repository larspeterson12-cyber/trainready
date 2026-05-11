'use client';

import type { RecoveryScore } from '@/types/database';

interface RecoveryMiniGridProps {
  scores: RecoveryScore[];
}

export function RecoveryMiniGrid({ scores }: RecoveryMiniGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {scores.map((rs) => {
        const colorClass =
          rs.status === 'recovered'
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : rs.status === 'partial'
            ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            : 'bg-red-500/10 text-red-500 border-red-500/20';

        return (
          <div
            key={rs.muscleGroupId}
            className={`rounded-xl border p-2.5 text-center ${colorClass}`}
          >
            <div className="text-lg font-bold leading-tight">{rs.score}</div>
            <div className="text-[9px] leading-tight text-[--color-text-secondary]">
              {rs.displayName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
