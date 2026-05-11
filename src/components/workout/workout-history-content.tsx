'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Dumbbell, Clock, Flame, TrendingUp, LayoutList, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { WORKOUT_TYPE_LABELS } from '@/lib/recovery/constants';
import type { WorkoutType } from '@/types/database';

interface WorkoutSet {
  id: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  rir: number | null;
}

interface WorkoutExercise {
  id: string;
  order_index: number;
  exercise: { id: string; name: string };
  sets: WorkoutSet[];
}

interface WorkoutEntry {
  id: string;
  date: string;
  workout_type: WorkoutType;
  duration_minutes: number | null;
  session_rpe: number | null;
  notes: string | null;
  workout_exercises: WorkoutExercise[];
}

interface Props {
  workouts: WorkoutEntry[];
}

const WORKOUT_TYPE_COLORS: Record<WorkoutType, string> = {
  push: 'bg-blue-500/15 text-blue-400',
  pull: 'bg-purple-500/15 text-purple-400',
  legs: 'bg-green-500/15 text-green-400',
  upper: 'bg-orange-500/15 text-orange-400',
  lower: 'bg-teal-500/15 text-teal-400',
  full_body: 'bg-pink-500/15 text-pink-400',
  custom: 'bg-gray-500/15 text-gray-400',
};

function formatDate(dateStr: string): { dayLabel: string; fullDate: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);

  let dayLabel = '';
  if (diff === 0) dayLabel = 'Vandaag';
  else if (diff === 1) dayLabel = 'Gisteren';
  else if (diff < 7) dayLabel = `${diff} dagen geleden`;

  const fullDate = date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return { dayLabel, fullDate };
}

function groupByMonth(workouts: WorkoutEntry[]) {
  const groups: { label: string; workouts: WorkoutEntry[] }[] = [];
  const seen = new Map<string, number>();

  for (const w of workouts) {
    const [year, month] = w.date.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const key = `${year}-${month}`;
    const label = date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ label, workouts: [] });
    }
    groups[seen.get(key)!].workouts.push(w);
  }

  return groups;
}

export function WorkoutHistoryContent({ workouts: initialWorkouts }: Props) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteWorkout(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('workouts').delete().eq('id', id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setDeletingId(null);
    if (expandedId === id) setExpandedId(null);
  }

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--color-surface]">
          <Dumbbell size={28} className="text-[--color-text-muted]" />
        </div>
        <h2 className="mb-2 text-lg font-semibold">Nog geen trainingen</h2>
        <p className="text-sm text-[--color-text-muted]">
          Log je eerste training en hij verschijnt hier.
        </p>
      </div>
    );
  }

  const groups = groupByMonth(workouts);

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Logboek</h1>
        <div className="flex gap-2">
          <Link
            href="/workout/templates"
            className="flex items-center gap-1.5 rounded-xl bg-[--color-surface] border border-[--color-border] px-3 py-2 text-xs font-semibold text-[--color-text-secondary] hover:text-[--color-accent] transition-colors"
          >
            <LayoutList size={13} />
            Schema's
          </Link>
          <Link
            href="/workout/progress"
            className="flex items-center gap-1.5 rounded-xl bg-[--color-surface] border border-[--color-border] px-3 py-2 text-xs font-semibold text-[--color-text-secondary] hover:text-[--color-accent] transition-colors"
          >
            <TrendingUp size={13} />
            Voortgang
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[--color-text-muted]">
              {group.label}
            </p>
            <div className="flex flex-col gap-2">
              {group.workouts.map((workout) => {
                const isExpanded = expandedId === workout.id;
                const { dayLabel, fullDate } = formatDate(workout.date);
                const exercises = [...(workout.workout_exercises ?? [])].sort(
                  (a, b) => a.order_index - b.order_index
                );
                const totalSets = exercises.reduce(
                  (acc, ex) => acc + ex.sets.filter((s) => s.reps > 0).length,
                  0
                );

                return (
                  <div
                    key={workout.id}
                    className="overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-card]"
                  >
                    {/* Header — always visible */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : workout.id)}
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      {/* Type badge */}
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          WORKOUT_TYPE_COLORS[workout.workout_type]
                        }`}
                      >
                        {WORKOUT_TYPE_LABELS[workout.workout_type] ?? workout.workout_type}
                      </span>

                      {/* Date + stats */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {dayLabel || fullDate}
                        </p>
                        {dayLabel && (
                          <p className="text-xs capitalize text-[--color-text-muted]">{fullDate}</p>
                        )}
                        <div className="mt-1 flex gap-3">
                          {totalSets > 0 && (
                            <span className="flex items-center gap-1 text-xs text-[--color-text-secondary]">
                              <Dumbbell size={11} />
                              {totalSets} sets
                            </span>
                          )}
                          {workout.duration_minutes && (
                            <span className="flex items-center gap-1 text-xs text-[--color-text-secondary]">
                              <Clock size={11} />
                              {workout.duration_minutes} min
                            </span>
                          )}
                          {workout.session_rpe && (
                            <span className="flex items-center gap-1 text-xs text-[--color-text-secondary]">
                              <Flame size={11} />
                              RPE {workout.session_rpe}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 text-[--color-text-muted]">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-[--color-border] px-4 pb-4 pt-3">
                        {exercises.length === 0 ? (
                          <p className="text-sm text-[--color-text-muted]">Geen oefeningen opgeslagen.</p>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {exercises.map((ex) => {
                              const completedSets = ex.sets
                                .filter((s) => s.reps > 0)
                                .sort((a, b) => a.set_number - b.set_number);

                              return (
                                <div key={ex.id}>
                                  <p className="mb-1.5 text-sm font-semibold">
                                    {ex.exercise.name}
                                  </p>
                                  {completedSets.length === 0 ? (
                                    <p className="text-xs text-[--color-text-muted]">Geen sets</p>
                                  ) : (
                                    <div className="flex flex-col gap-1">
                                      {completedSets.map((set) => (
                                        <div
                                          key={set.id}
                                          className="flex items-center gap-2 text-xs text-[--color-text-secondary]"
                                        >
                                          <span className="w-10 font-medium text-[--color-text-muted]">
                                            Set {set.set_number}
                                          </span>
                                          <span className="font-semibold text-[--color-text]">
                                            {set.weight_kg > 0
                                              ? `${set.weight_kg} kg × ${set.reps}`
                                              : `${set.reps} reps`}
                                          </span>
                                          {set.rir !== null && (
                                            <span className="text-[--color-text-muted]">
                                              RIR {set.rir}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {workout.notes && (
                          <p className="mt-3 rounded-lg bg-[--color-surface] px-3 py-2 text-xs text-[--color-text-secondary] italic">
                            {workout.notes}
                          </p>
                        )}

                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          disabled={deletingId === workout.id}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[--color-red]/30 py-2.5 text-sm font-medium text-[--color-red] disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {deletingId === workout.id ? 'Verwijderen...' : 'Training verwijderen'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
