'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, Activity, Zap, ChevronRight } from 'lucide-react';
import type {
  Profile,
  MuscleGroup,
  Workout,
  MuscleFatigueLog,
  RecoveryScore,
} from '@/types/database';
import { calculateAllRecoveryScores, getRecoveryStatus } from '@/lib/recovery/engine';
import { generateAdvice } from '@/lib/advice/engine';
import { WORKOUT_TYPE_LABELS } from '@/lib/recovery/constants';
import { RecoveryMiniGrid } from '@/components/recovery/recovery-mini-grid';

interface DashboardContentProps {
  profile: Profile | null;
  muscleGroups: MuscleGroup[];
  recentWorkouts: Workout[];
  fatigueLogs: MuscleFatigueLog[];
}

export function DashboardContent({
  profile,
  muscleGroups,
  recentWorkouts,
  fatigueLogs,
}: DashboardContentProps) {
  const [availableMinutes, setAvailableMinutes] = useState(
    profile?.avg_session_minutes ?? 60
  );

  // Calculate recovery scores
  const recoveryScores = useMemo(
    () => calculateAllRecoveryScores(muscleGroups, fatigueLogs),
    [muscleGroups, fatigueLogs]
  );

  // Generate advice
  const advice = useMemo(() => {
    if (!profile) return null;
    return generateAdvice({
      recoveryScores,
      preferredSplit: profile.preferred_split,
      trainingGoal: profile.training_goal,
      trainingDaysPerWeek: profile.training_days_per_week,
      avgSessionMinutes: profile.avg_session_minutes,
      availableMinutes,
      recentWorkouts: recentWorkouts.map((w) => ({
        date: w.date,
        workout_type: w.workout_type,
      })),
    });
  }, [recoveryScores, profile, availableMinutes, recentWorkouts]);

  const lastWorkout = recentWorkouts[0] ?? null;
  const greeting = getGreeting();

  const topRecovered = [...recoveryScores]
    .filter((rs) => rs.status === 'recovered')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const lowRecovered = [...recoveryScores]
    .filter((rs) => rs.status !== 'recovered')
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Greeting */}
      <div className="mb-5">
        <p className="text-sm text-[--color-text-secondary]">{greeting}</p>
        <h1 className="text-2xl font-bold">{profile?.display_name ?? 'Gebruiker'}</h1>
      </div>

      {/* Advice Card */}
      {advice && (
        <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[--color-accent-dim] via-[--color-accent] to-[--color-accent-light] p-5">
          <div className="absolute -top-5 -right-5 h-24 w-24 rounded-full bg-white/[0.08]" />
          <div className="absolute -bottom-8 right-5 h-20 w-20 rounded-full bg-white/[0.05]" />

          <div className="mb-2.5 flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">
              Advies van vandaag
            </span>
          </div>

          <h2 className="mb-1.5 text-xl font-bold text-white">
            {advice.isRestDay
              ? advice.splitDisplayName
              : `Train vandaag ${advice.splitDisplayName}`}
          </h2>
          <p className="mb-3.5 text-sm leading-relaxed text-white/75">
            {advice.reason}
          </p>

          {!advice.isRestDay && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Clock size={13} className="text-white/60" />
                <span className="text-xs text-white/70">~{advice.estimatedDuration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={13} className="text-white/60" />
                <span className="text-xs capitalize text-white/70">
                  {advice.intensity === 'heavy' ? 'Hoge' : advice.intensity === 'normal' ? 'Normale' : 'Lage'} intensiteit
                </span>
              </div>
            </div>
          )}

          {advice.alternativeSplit && !advice.isRestDay && (
            <p className="mt-3 text-xs text-white/50">
              Alternatief: {advice.alternativeReason}
            </p>
          )}
        </div>
      )}

      {/* Quick Log Button */}
      <Link
        href="/workout/new"
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[--color-border] bg-[--color-surface] px-4 py-3.5 text-[15px] font-semibold text-[--color-accent] transition-colors hover:border-[--color-accent]/40 hover:bg-[--color-accent]/5"
      >
        <Plus size={18} />
        Log training
      </Link>

      {/* Recovery Summary */}
      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Herstelstatus</h3>
          <Link href="/recovery" className="text-xs text-[--color-text-muted] hover:text-[--color-text-secondary]">
            Alle spiergroepen →
          </Link>
        </div>
        <RecoveryMiniGrid scores={recoveryScores} />
      </div>

      {/* Most / Least recovered */}
      {topRecovered.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">Meest hersteld</h3>
          <div className="flex gap-2">
            {topRecovered.map((rs) => (
              <div
                key={rs.muscleGroupId}
                className="flex-1 rounded-xl bg-[--color-card] p-2.5 border-l-[3px] border-l-[--color-green]"
              >
                <div className="text-sm font-semibold">{rs.displayName}</div>
                <div className="mt-0.5 text-xs text-[--color-green]">{rs.score}% hersteld</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowRecovered.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">Minst hersteld</h3>
          <div className="flex gap-2">
            {lowRecovered.map((rs) => (
              <div
                key={rs.muscleGroupId}
                className={`flex-1 rounded-xl bg-[--color-card] p-2.5 border-l-[3px] ${
                  rs.status === 'fatigued' ? 'border-l-[--color-red]' : 'border-l-[--color-orange]'
                }`}
              >
                <div className="text-sm font-semibold">{rs.displayName}</div>
                <div className={`mt-0.5 text-xs ${
                  rs.status === 'fatigued' ? 'text-[--color-red]' : 'text-[--color-orange]'
                }`}>
                  {rs.score}% — {rs.status === 'fatigued' ? 'Niet hersteld' : 'Gedeeltelijk'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Workout */}
      {lastWorkout && (
        <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Laatste training</h3>
            <span className="text-xs text-[--color-text-muted]">
              {formatRelativeDate(lastWorkout.date)}
            </span>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Stat label="Type" value={WORKOUT_TYPE_LABELS[lastWorkout.workout_type] ?? lastWorkout.workout_type} />
            {lastWorkout.duration_minutes && (
              <Stat label="Duur" value={`${lastWorkout.duration_minutes} min`} />
            )}
            {lastWorkout.session_rpe && (
              <Stat
                label="RPE"
                value={`${lastWorkout.session_rpe}/10`}
                color={lastWorkout.session_rpe >= 8 ? 'text-[--color-orange]' : undefined}
              />
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentWorkouts.length === 0 && (
        <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-6 text-center">
          <p className="mb-2 text-sm text-[--color-text-secondary]">
            Nog geen trainingen gelogd
          </p>
          <p className="text-xs text-[--color-text-muted]">
            Log je eerste training om persoonlijk advies te activeren.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span className="text-xs text-[--color-text-secondary]">{label}</span>
      <div className={`text-sm font-medium ${color ?? ''}`}>{value}</div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function formatRelativeDate(dateStr: string): string {
  // Parse YYYY-MM-DD as local date (not UTC) to avoid timezone offset issues
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);

  if (diff === 0) return 'Vandaag';
  if (diff === 1) return 'Gisteren';
  if (diff < 7) return `${diff} dagen geleden`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}
