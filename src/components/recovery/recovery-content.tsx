'use client';

import { useMemo, useState } from 'react';
import type { MuscleGroup, MuscleFatigueLog, RecoveryScore } from '@/types/database';
import { calculateAllRecoveryScores } from '@/lib/recovery/engine';

interface RecoveryContentProps {
  muscleGroups: MuscleGroup[];
  fatigueLogs: MuscleFatigueLog[];
}

export function RecoveryContent({ muscleGroups, fatigueLogs }: RecoveryContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recoveryScores = useMemo(
    () => calculateAllRecoveryScores(muscleGroups, fatigueLogs),
    [muscleGroups, fatigueLogs]
  );

  const sorted = [...recoveryScores].sort((a, b) => a.score - b.score);

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="mb-1 text-[22px] font-bold">Herstel</h1>
      <p className="mb-4 text-sm text-[--color-text-secondary]">
        Per spiergroep — tap voor details
      </p>

      {/* Legend */}
      <div className="mb-4 flex gap-4">
        <LegendItem color="bg-green-500" label="Hersteld (70-100)" />
        <LegendItem color="bg-orange-500" label="Gedeeltelijk (40-69)" />
        <LegendItem color="bg-red-500" label="Niet hersteld (0-39)" />
      </div>

      {/* Muscle group list */}
      <div className="flex flex-col gap-2">
        {sorted.map((rs) => {
          const isOpen = expandedId === rs.muscleGroupId;
          const statusColor =
            rs.status === 'recovered'
              ? 'text-green-500 border-green-500 bg-green-500/10'
              : rs.status === 'partial'
              ? 'text-orange-500 border-orange-500 bg-orange-500/10'
              : 'text-red-500 border-red-500 bg-red-500/10';

          const barColor =
            rs.status === 'recovered'
              ? 'bg-green-500'
              : rs.status === 'partial'
              ? 'bg-orange-500'
              : 'bg-red-500';

          const pillColor =
            rs.status === 'recovered'
              ? 'text-green-500 bg-green-500/10'
              : rs.status === 'partial'
              ? 'text-orange-500 bg-orange-500/10'
              : 'text-red-500 bg-red-500/10';

          return (
            <div key={rs.muscleGroupId}>
              <button
                onClick={() => setExpandedId(isOpen ? null : rs.muscleGroupId)}
                className={`flex w-full items-center gap-3 rounded-xl bg-[--color-card] p-3.5 text-left transition-all ${
                  isOpen ? 'border border-[--color-border]' : 'border border-transparent'
                }`}
              >
                {/* Score circle */}
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 ${statusColor}`}
                >
                  <span className="text-base font-bold">{rs.score}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">{rs.displayName}</div>
                  <div className="mt-0.5 text-xs text-[--color-text-secondary]">
                    {rs.lastTrainedAt ? formatRelative(rs.lastTrainedAt) : 'Nog niet getraind'}
                  </div>
                </div>

                {/* Status pill */}
                <div className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${pillColor}`}>
                  {rs.status === 'recovered' ? 'Hersteld' : rs.status === 'partial' ? 'Gedeeltelijk' : 'Niet hersteld'}
                </div>

                {/* Progress bar */}
                <div className="h-1 w-12 flex-shrink-0 rounded bg-[--color-border]">
                  <div
                    className={`h-full rounded ${barColor} transition-all duration-500`}
                    style={{ width: `${rs.score}%` }}
                  />
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="-mt-1 rounded-b-xl bg-[--color-surface] px-4 py-3">
                  <div className="mb-2 text-xs text-[--color-text-secondary]">
                    Geschat volledig herstel
                  </div>
                  <div className="text-sm font-medium">
                    {rs.score >= 90
                      ? 'Nu — klaar voor zware belasting'
                      : rs.score >= 70
                      ? 'Grotendeels hersteld — normale training mogelijk'
                      : rs.score >= 40
                      ? '~12-24 uur — voorzichtig trainbaar'
                      : '~24-48 uur — rust aanbevolen'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] text-[--color-text-secondary]">{label}</span>
    </div>
  );
}

function formatRelative(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );
  if (diff === 0) return 'Vandaag';
  if (diff === 1) return 'Gisteren';
  return `${diff} dagen geleden`;
}
