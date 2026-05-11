'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, ChevronDown, ChevronUp, Play, X, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { WORKOUT_TYPE_LABELS } from '@/lib/recovery/constants';
import type { WorkoutType } from '@/types/database';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateSet {
  id: string;
  set_number: number;
  default_weight_kg: number;
  default_reps: number;
}

interface TemplateExercise {
  id: string;
  order_index: number;
  exercise: { id: string; name: string };
  sets: TemplateSet[];
}

interface Template {
  id: string;
  name: string;
  workout_type: WorkoutType;
  workout_template_exercises: TemplateExercise[];
}

interface Exercise {
  id: string;
  name: string;
  muscle_groups: any[];
}

interface Props {
  userId: string;
  templates: Template[];
  exercises: Exercise[];
}

// ─── New template state ────────────────────────────────────────────────────────

interface DraftSet {
  set_number: number;
  weight_kg: number;
  reps: number;
}

interface DraftExercise {
  exerciseId: string;
  exerciseName: string;
  sets: DraftSet[];
}

const WORKOUT_TYPES: WorkoutType[] = ['push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'custom'];

// ─── Component ────────────────────────────────────────────────────────────────

export function WorkoutTemplatesContent({ userId, templates: initialTemplates, exercises }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [templates, setTemplates] = useState(initialTemplates);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Draft state for new template
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState<WorkoutType>('push');
  const [draftExercises, setDraftExercises] = useState<DraftExercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // ── Exercise picker ──
  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  function addExercise(ex: Exercise) {
    setDraftExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: [{ set_number: 1, weight_kg: 0, reps: 10 }],
      },
    ]);
    setExerciseSearch('');
    setShowExercisePicker(false);
  }

  function removeExercise(idx: number) {
    setDraftExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  function addSet(exIdx: number) {
    setDraftExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  set_number: ex.sets.length + 1,
                  weight_kg: ex.sets[ex.sets.length - 1]?.weight_kg ?? 0,
                  reps: ex.sets[ex.sets.length - 1]?.reps ?? 10,
                },
              ],
            }
          : ex
      )
    );
  }

  function removeSet(exIdx: number, setIdx: number) {
    setDraftExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets
                .filter((_, si) => si !== setIdx)
                .map((s, si) => ({ ...s, set_number: si + 1 })),
            }
          : ex
      )
    );
  }

  function updateSet(exIdx: number, setIdx: number, field: 'weight_kg' | 'reps', value: number) {
    setDraftExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, si) =>
                si === setIdx ? { ...s, [field]: value } : s
              ),
            }
          : ex
      )
    );
  }

  // ── Save template ──
  async function saveTemplate() {
    if (!draftName.trim()) { setError('Geef het template een naam.'); return; }
    if (draftExercises.length === 0) { setError('Voeg minimaal één oefening toe.'); return; }
    setSaving(true);
    setError('');

    // Insert template
    const { data: tmpl, error: tmplErr } = await supabase
      .from('workout_templates')
      .insert({ user_id: userId, name: draftName.trim(), workout_type: draftType })
      .select()
      .single();

    if (tmplErr || !tmpl) { setError('Opslaan mislukt.'); setSaving(false); return; }

    // Insert exercises + sets
    for (let i = 0; i < draftExercises.length; i++) {
      const ex = draftExercises[i];
      const { data: wte, error: wteErr } = await supabase
        .from('workout_template_exercises')
        .insert({ template_id: tmpl.id, exercise_id: ex.exerciseId, order_index: i })
        .select()
        .single();

      if (wteErr || !wte) continue;

      await supabase.from('workout_template_sets').insert(
        ex.sets.map((s) => ({
          template_exercise_id: wte.id,
          set_number: s.set_number,
          default_weight_kg: s.weight_kg,
          default_reps: s.reps,
        }))
      );
    }

    setSaving(false);
    setShowNew(false);
    setDraftName('');
    setDraftType('push');
    setDraftExercises([]);
    router.refresh();
  }

  // ── Delete template ──
  async function deleteTemplate(id: string) {
    await supabase.from('workout_templates').delete().eq('id', id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Schema's</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[--color-accent] px-3 py-2 text-xs font-semibold text-white"
        >
          <Plus size={14} />
          Nieuw
        </button>
      </div>

      {/* Template list */}
      {templates.length === 0 && !showNew && (
        <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-8 text-center">
          <p className="mb-1 text-sm font-semibold">Nog geen schema's</p>
          <p className="text-xs text-[--color-text-muted]">Maak je eerste schema aan met de "Nieuw" knop.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {templates.map((tmpl) => {
          const isOpen = expandedId === tmpl.id;
          const exercises = [...(tmpl.workout_template_exercises ?? [])].sort(
            (a, b) => a.order_index - b.order_index
          );
          return (
            <div key={tmpl.id} className="overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-card]">
              <button
                onClick={() => setExpandedId(isOpen ? null : tmpl.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="shrink-0 rounded-lg bg-[--color-accent]/15 px-2.5 py-1 text-xs font-semibold text-[--color-accent]">
                  {WORKOUT_TYPE_LABELS[tmpl.workout_type]}
                </span>
                <span className="flex-1 text-sm font-semibold">{tmpl.name}</span>
                <span className="text-xs text-[--color-text-muted]">{exercises.length} oef.</span>
                {isOpen ? <ChevronUp size={16} className="text-[--color-text-muted]" /> : <ChevronDown size={16} className="text-[--color-text-muted]" />}
              </button>

              {isOpen && (
                <div className="border-t border-[--color-border] px-4 pb-4 pt-3">
                  {exercises.map((ex) => (
                    <div key={ex.id} className="mb-3">
                      <p className="mb-1 text-sm font-semibold">{ex.exercise.name}</p>
                      {ex.sets.sort((a, b) => a.set_number - b.set_number).map((s) => (
                        <p key={s.id} className="text-xs text-[--color-text-secondary]">
                          Set {s.set_number} — {s.default_weight_kg > 0 ? `${s.default_weight_kg} kg × ` : ''}{s.default_reps} reps
                        </p>
                      ))}
                    </div>
                  ))}

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/workout/new?template=${tmpl.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[--color-accent] py-2.5 text-sm font-semibold text-white"
                    >
                      <Play size={14} fill="currentColor" />
                      Start training
                    </Link>
                    <button
                      onClick={() => deleteTemplate(tmpl.id)}
                      className="flex items-center justify-center rounded-xl bg-[--color-surface] px-3 py-2.5 text-[--color-red]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New template form */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[--color-bg] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[--color-border] bg-[--color-bg] px-4 py-3">
            <h2 className="text-lg font-bold">Nieuw schema</h2>
            <button onClick={() => setShowNew(false)} className="text-[--color-text-muted]">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Naam</label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="bijv. Push dag A"
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:border-[--color-accent] focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Type</label>
              <div className="flex flex-wrap gap-2">
                {WORKOUT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDraftType(t)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      draftType === t
                        ? 'bg-[--color-accent] text-white'
                        : 'bg-[--color-surface] text-[--color-text-secondary]'
                    }`}
                  >
                    {WORKOUT_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercises */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Oefeningen</label>

              {draftExercises.map((ex, exIdx) => (
                <div key={exIdx} className="mb-3 rounded-xl border border-[--color-border] bg-[--color-card] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">{ex.exerciseName}</p>
                    <button onClick={() => removeExercise(exIdx)} className="text-[--color-text-muted]">
                      <X size={14} />
                    </button>
                  </div>

                  {ex.sets.map((s, setIdx) => (
                    <div key={setIdx} className="mb-1.5 flex items-center gap-2">
                      <span className="w-10 text-xs text-[--color-text-muted]">Set {s.set_number}</span>
                      <input
                        type="number"
                        value={s.weight_kg || ''}
                        onChange={(e) => updateSet(exIdx, setIdx, 'weight_kg', parseFloat(e.target.value) || 0)}
                        placeholder="kg"
                        className="w-16 rounded-lg border border-[--color-border] bg-[--color-surface] px-2 py-1.5 text-center text-xs text-[--color-text] focus:outline-none"
                      />
                      <span className="text-xs text-[--color-text-muted]">×</span>
                      <input
                        type="number"
                        value={s.reps || ''}
                        onChange={(e) => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                        placeholder="reps"
                        className="w-16 rounded-lg border border-[--color-border] bg-[--color-surface] px-2 py-1.5 text-center text-xs text-[--color-text] focus:outline-none"
                      />
                      {ex.sets.length > 1 && (
                        <button onClick={() => removeSet(exIdx, setIdx)} className="ml-auto text-[--color-text-muted]">
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => addSet(exIdx)}
                    className="mt-1 text-xs font-medium text-[--color-accent]"
                  >
                    + Set toevoegen
                  </button>
                </div>
              ))}

              {/* Exercise picker */}
              {showExercisePicker ? (
                <div className="rounded-xl border border-[--color-border] bg-[--color-card]">
                  <div className="p-2">
                    <input
                      type="text"
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                      placeholder="Zoek oefening..."
                      autoFocus
                      className="w-full rounded-lg border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:outline-none"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredExercises.slice(0, 30).map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => addExercise(ex)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-[--color-surface]"
                      >
                        {ex.name}
                        <Check size={14} className={draftExercises.some((d) => d.exerciseId === ex.id) ? 'text-[--color-accent]' : 'opacity-0'} />
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[--color-border] p-2">
                    <button onClick={() => setShowExercisePicker(false)} className="w-full py-2 text-xs text-[--color-text-muted]">
                      Sluiten
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowExercisePicker(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[--color-border] py-3 text-sm font-medium text-[--color-accent]"
                >
                  <Plus size={16} />
                  Oefening toevoegen
                </button>
              )}
            </div>

            {error && <p className="text-xs text-[--color-red]">{error}</p>}

            <button
              onClick={saveTemplate}
              disabled={saving}
              className="flex items-center justify-center rounded-xl bg-[--color-accent] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Opslaan...' : 'Schema opslaan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
