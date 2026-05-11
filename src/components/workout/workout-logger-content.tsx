'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Check, Minus, Search, X, Loader2, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { calculateWorkoutFatigue } from '@/lib/recovery/engine';
import type { WorkoutType, ExerciseWithMuscleGroups } from '@/types/database';

const WORKOUT_TYPE_MUSCLES: Record<WorkoutType, string[]> = {
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps'],
  legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  lower: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
  full_body: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
  custom: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
};

const WORKOUT_TYPES: { key: WorkoutType; label: string; muscles: string; icon: string }[] = [
  { key: 'push', label: 'Push', muscles: 'Borst, Schouders, Triceps', icon: '💪' },
  { key: 'pull', label: 'Pull', muscles: 'Rug, Biceps', icon: '🏋️' },
  { key: 'legs', label: 'Legs', muscles: 'Quads, Hamstrings, Bilspieren, Kuiten', icon: '🦵' },
  { key: 'upper', label: 'Upper', muscles: 'Borst, Rug, Schouders, Armen', icon: '⬆️' },
  { key: 'lower', label: 'Lower', muscles: 'Benen, Bilspieren, Core', icon: '⬇️' },
  { key: 'full_body', label: 'Full Body', muscles: 'Alle spiergroepen', icon: '🔥' },
];

interface SetData {
  reps: number;
  weightKg: number;
  completed: boolean;
}

interface ExerciseEntry {
  exerciseId: string;
  exerciseName: string;
  sets: SetData[];
  muscleGroups: { muscleGroupId: string; muscleGroupName: string; weight: number }[];
}

interface WorkoutLoggerContentProps {
  userId: string;
  exercises: ExerciseWithMuscleGroups[];
  recentSets: any[];
  template?: any | null;
}

export function WorkoutLoggerContent({
  userId,
  exercises,
  recentSets,
  template,
}: WorkoutLoggerContentProps) {
  // Pre-fill from template if provided
  const initialEntries: ExerciseEntry[] = template
    ? [...(template.workout_template_exercises ?? [])]
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((wte: any) => ({
          exerciseId: wte.exercise.id,
          exerciseName: wte.exercise.name,
          sets: [...(wte.sets ?? [])]
            .sort((a: any, b: any) => a.set_number - b.set_number)
            .map((s: any) => ({
              reps: s.default_reps ?? 10,
              weightKg: s.default_weight_kg ?? 0,
              completed: false,
            })),
          muscleGroups: exercises
            .find((ex) => ex.id === wte.exercise.id)
            ?.muscle_groups.map((mg: any) => ({
              muscleGroupId: mg.muscle_group_id,
              muscleGroupName: mg.muscle_group?.name ?? '',
              weight: mg.weight ?? 1,
            })) ?? [],
        }))
    : [];

  const [step, setStep] = useState<'type' | 'exercises' | 'finish'>(
    template ? 'exercises' : 'type'
  );
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(
    template ? template.workout_type : null
  );
  const [entries, setEntries] = useState<ExerciseEntry[]>(initialEntries);
  const [rpe, setRpe] = useState(7);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const startTime = useMemo(() => Date.now(), []);

  // Get previous sets per set-number for an exercise (most recent workout)
  function getPreviousWorkoutSets(exerciseId: string): Map<number, { weight_kg: number; reps: number }> {
    const map = new Map<number, { weight_kg: number; reps: number }>();
    // recentSets is ordered by created_at DESC — find the most recent workout date for this exercise
    const relevant = recentSets.filter(
      (s: any) => s.workout_exercise?.exercise_id === exerciseId &&
                  s.workout_exercise?.workout?.user_id === userId
    );
    if (relevant.length === 0) return map;

    // Find the most recent workout date
    const mostRecentDate = relevant
      .map((s: any) => s.workout_exercise?.workout?.date ?? '')
      .sort()
      .reverse()[0];

    // Get all sets from that workout
    relevant
      .filter((s: any) => s.workout_exercise?.workout?.date === mostRecentDate)
      .forEach((s: any) => {
        map.set(s.set_number, { weight_kg: s.weight_kg, reps: s.reps });
      });

    return map;
  }

  function addExercise(exercise: ExerciseWithMuscleGroups) {
    const newEntry: ExerciseEntry = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [{ reps: 10, weightKg: 0, completed: false }],
      muscleGroups: exercise.muscle_groups.map((emg: any) => ({
        muscleGroupId: emg.muscle_group.id,
        muscleGroupName: emg.muscle_group.name,
        weight: emg.weight,
      })),
    };
    setEntries([...entries, newEntry]);
    setShowExercisePicker(false);
    setSearchQuery('');
  }

  function updateSet(exerciseIdx: number, setIdx: number, field: keyof SetData, value: any) {
    const updated = [...entries];
    updated[exerciseIdx].sets[setIdx] = {
      ...updated[exerciseIdx].sets[setIdx],
      [field]: value,
    };
    setEntries(updated);
  }

  function addSet(exerciseIdx: number) {
    const updated = [...entries];
    const lastSet = updated[exerciseIdx].sets[updated[exerciseIdx].sets.length - 1];
    updated[exerciseIdx].sets.push({ ...lastSet, completed: false });
    setEntries(updated);
  }

  function removeExercise(idx: number) {
    setEntries(entries.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!workoutType || entries.length === 0) return;
    setSaving(true);
    setSaveError('');

    const supabase = createClient();
    const autoMinutes = Math.round((Date.now() - startTime) / 60000);

    // Create workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        workout_type: workoutType,
        duration_minutes: durationMinutes || autoMinutes,
        session_rpe: rpe,
        notes: notes || null,
      })
      .select()
      .single();

    if (workoutError || !workout) {
      setSaveError('Opslaan mislukt. Controleer je verbinding en probeer opnieuw.');
      setSaving(false);
      return;
    }

    // Insert exercises and sets
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const { data: we } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workout.id,
          exercise_id: entry.exerciseId,
          order_index: i,
        })
        .select()
        .single();

      if (we) {
        const setsToInsert = entry.sets
          .filter((s) => s.completed)
          .map((s, si) => ({
            workout_exercise_id: we.id,
            set_number: si + 1,
            reps: s.reps,
            weight_kg: s.weightKg,
            completed: true,
          }));

        if (setsToInsert.length > 0) {
          await supabase.from('workout_sets').insert(setsToInsert);
        }
      }
    }

    // Calculate and save fatigue
    const fatigueData = calculateWorkoutFatigue(
      entries.map((e) => ({
        exerciseId: e.exerciseId,
        setCount: e.sets.filter((s) => s.reps > 0).length,
        muscleGroups: e.muscleGroups.map((mg) => ({
          muscleGroupId: mg.muscleGroupId,
          muscleGroupName: mg.muscleGroupName as any,
          weight: mg.weight,
        })),
      })),
      rpe
    );

    const fatigueLogs = Array.from(fatigueData.values()).map((f) => ({
      user_id: userId,
      muscle_group_id: f.muscleGroupId,
      workout_id: workout.id,
      fatigue_points: Math.round(f.fatiguePoints * 100) / 100,
    }));

    if (fatigueLogs.length > 0) {
      const { error: fatigueError } = await supabase.from('muscle_fatigue_logs').insert(fatigueLogs);
      if (fatigueError) {
        setSaveError('Training opgeslagen, maar hersteldata kon niet worden bijgewerkt.');
        setSaving(false);
        return;
      }
    }

    router.push('/dashboard');
    router.refresh();
  }

  // Filter exercises for picker: alleen oefeningen passend bij het workout type
  const relevantMuscles = workoutType ? WORKOUT_TYPE_MUSCLES[workoutType] : [];
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const notAdded = !entries.some((e) => e.exerciseId === ex.id);
    const matchesMuscle = ex.muscle_groups.some((mg: any) =>
      relevantMuscles.includes(mg.muscle_group.name)
    );
    return matchesSearch && notAdded && matchesMuscle;
  });

  // ============================================================
  // Step: Choose Workout Type
  // ============================================================
  if (step === 'type') {
    return (
      <div className="px-4 pt-5 pb-4">
        <h1 className="mb-1 text-[22px] font-bold">Nieuwe training</h1>
        <p className="mb-4 text-sm text-[--color-text-secondary]">Kies je trainingstype</p>
        <div className="flex flex-col gap-2">
          {WORKOUT_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setWorkoutType(t.key);
                setStep('exercises');
              }}
              className="flex w-full items-center gap-3.5 rounded-xl border border-[--color-border] bg-[--color-card] p-4 text-left transition-colors hover:bg-[--color-card]/80"
            >
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1">
                <div className="text-base font-semibold">{t.label}</div>
                <div className="mt-0.5 text-xs text-[--color-text-secondary]">{t.muscles}</div>
              </div>
              <ChevronRight size={18} className="text-[--color-text-muted]" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // Step: Log Exercises
  // ============================================================
  if (step === 'exercises') {
    return (
      <div className="px-4 pt-5 pb-4">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setStep('type')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {WORKOUT_TYPES.find((t) => t.key === workoutType)?.label} training
            </h1>
            <p className="text-xs text-[--color-text-secondary]">
              {entries.length} oefeningen
            </p>
          </div>
        </div>

        {/* Exercise entries */}
        <div className="flex flex-col gap-3">
          {entries.map((entry, ei) => {
            const prevSets = getPreviousWorkoutSets(entry.exerciseId);
            return (
              <div
                key={ei}
                className="overflow-hidden rounded-xl border border-[--color-border] bg-[--color-card]"
              >
                <div className="flex items-center justify-between p-3">
                  <div>
                    <div className="text-[15px] font-semibold">{entry.exerciseName}</div>
                    {prevSets.size > 0 && (
                      <div className="mt-0.5 text-[11px] text-[--color-text-muted]">
                        Vorige sessie
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeExercise(ei)}
                    className="text-[--color-text-muted] hover:text-[--color-red]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-3 pb-2.5">
                  {/* Header */}
                  <div className="mb-1 flex gap-0 text-[10px] font-semibold uppercase text-[--color-text-muted]">
                    <span className="w-10">Set</span>
                    <span className="flex-1">KG</span>
                    <span className="flex-1">Reps</span>
                    <span className="w-8" />
                  </div>

                  {entry.sets.map((s, si) => {
                    const prev = prevSets.get(si + 1);
                    return (
                    <div key={si} className="border-t border-[--color-border] py-1.5">
                      <div className="flex items-center gap-0">
                        <span className="w-10 text-sm text-[--color-text-secondary]">{si + 1}</span>
                        <input
                          type="number"
                          value={s.weightKg || ''}
                          onChange={(e) => updateSet(ei, si, 'weightKg', Number(e.target.value))}
                          placeholder={prev ? String(prev.weight_kg) : '0'}
                          className="mr-2 flex-1 rounded-md bg-[--color-surface] px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
                        />
                        <input
                          type="number"
                          value={s.reps || ''}
                          onChange={(e) => updateSet(ei, si, 'reps', Number(e.target.value))}
                          placeholder={prev ? String(prev.reps) : '0'}
                          className="mr-2 flex-1 rounded-md bg-[--color-surface] px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
                        />
                        <button
                          onClick={() => updateSet(ei, si, 'completed', !s.completed)}
                          className={`flex h-7 w-7 items-center justify-center rounded-md ${
                            s.completed
                              ? 'bg-green-500/15 text-green-500'
                              : 'bg-[--color-surface] text-[--color-text-muted]'
                          }`}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                      {prev && (
                        <div className="mt-0.5 pl-10 text-[10px] text-[--color-text-muted]">
                          Vorige: {prev.weight_kg > 0 ? `${prev.weight_kg}kg × ` : ''}{prev.reps} reps
                        </div>
                      )}
                    </div>
                    );
                  })}

                  <button
                    onClick={() => addSet(ei)}
                    className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-[--color-border] py-2 text-xs text-[--color-text-muted]"
                  >
                    <Plus size={12} /> Set toevoegen
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add exercise button / picker */}
        {showExercisePicker ? (
          <div className="mt-3 rounded-xl border border-[--color-border] bg-[--color-surface] p-3">
            <div className="mb-2 flex items-center gap-2">
              <Search size={16} className="text-[--color-text-muted]" />
              <input
                type="text"
                placeholder="Zoek oefening..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:outline-none"
              />
              <button onClick={() => { setShowExercisePicker(false); setSearchQuery(''); }}>
                <X size={16} className="text-[--color-text-muted]" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredExercises.slice(0, 20).map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-[--color-card]"
                >
                  <span>{ex.name}</span>
                  <span className="text-xs text-[--color-text-muted]">{ex.category}</span>
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <p className="py-4 text-center text-xs text-[--color-text-muted]">
                  Geen oefeningen gevonden
                </p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowExercisePicker(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[--color-border] bg-[--color-surface] px-4 py-3.5 text-sm font-medium text-[--color-accent]"
          >
            <Plus size={16} /> Oefening toevoegen
          </button>
        )}

        {/* Finish button */}
        {entries.length > 0 && (
          <button
            onClick={() => {
              setDurationMinutes(Math.round((Date.now() - startTime) / 60000));
              setStep('finish');
            }}
            className="mt-4 w-full rounded-xl bg-[--color-accent] px-4 py-4 text-base font-semibold text-white"
          >
            Training afronden
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // Step: Finish / RPE
  // ============================================================
  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => setStep('exercises')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Afronden</h1>
      </div>

      {/* Summary */}
      <div className="mb-5 rounded-xl border border-[--color-border] bg-[--color-card] p-4">
        <h3 className="mb-3 text-[15px] font-semibold">Samenvatting</h3>
        <div className="grid grid-cols-2 gap-3">
          <SummaryStat label="Type" value={WORKOUT_TYPES.find((t) => t.key === workoutType)?.label ?? ''} />
          <SummaryStat label="Oefeningen" value={String(entries.length)} />
          <SummaryStat label="Totale sets" value={String(entries.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0))} />
          <SummaryStat label="Duur" value={`${durationMinutes} min`} />
        </div>
      </div>

      {/* RPE */}
      <div className="mb-5 rounded-xl border border-[--color-border] bg-[--color-card] p-4">
        <h3 className="mb-1 text-[15px] font-semibold">Hoe zwaar voelde deze sessie?</h3>
        <p className="mb-4 text-xs text-[--color-text-secondary]">RPE — Rate of Perceived Exertion</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRpe(Math.max(1, rpe - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface]"
          >
            <Minus size={16} />
          </button>
          <div className="flex-1 text-center">
            <div className={`text-4xl font-extrabold ${
              rpe >= 8 ? 'text-[--color-red]' : rpe >= 5 ? 'text-[--color-orange]' : 'text-[--color-green]'
            }`}>
              {rpe}
            </div>
            <div className="text-xs text-[--color-text-secondary]">
              {rpe <= 3 ? 'Licht' : rpe <= 5 ? 'Matig' : rpe <= 7 ? 'Uitdagend' : rpe <= 9 ? 'Zwaar' : 'Maximaal'}
            </div>
          </div>
          <button
            onClick={() => setRpe(Math.min(10, rpe + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface]"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Visual scale */}
        <div className="mt-3 flex gap-0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < rpe
                  ? rpe >= 8 ? 'bg-[--color-red]' : rpe >= 5 ? 'bg-[--color-orange]' : 'bg-[--color-green]'
                  : 'bg-[--color-border]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Duration override */}
      <div className="mb-5 rounded-xl border border-[--color-border] bg-[--color-card] p-4">
        <label className="mb-2 block text-sm font-medium">Duur (minuten)</label>
        <input
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          className="w-full rounded-lg bg-[--color-surface] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
        />
      </div>

      {/* Notes */}
      <div className="mb-5 rounded-xl border border-[--color-border] bg-[--color-card] p-4">
        <label className="mb-2 block text-sm font-medium">Notities</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optioneel — hoe voelde de sessie?"
          rows={3}
          className="w-full rounded-lg bg-[--color-surface] px-3 py-2 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
        />
      </div>

      {/* Error */}
      {saveError && (
        <p className="mb-3 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-[--color-red]">{saveError}</p>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[--color-green] px-4 py-4 text-base font-semibold text-white transition-opacity disabled:opacity-50"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
        Training opslaan
      </button>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-[--color-text-secondary]">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
