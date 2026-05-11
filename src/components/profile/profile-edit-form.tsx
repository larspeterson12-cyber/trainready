'use client';

import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, TrainingGoal, TrainingLevel, PreferredSplit, GymPreference } from '@/types/database';

interface Props {
  profile: Profile;
  onSave: (updated: Profile) => void;
  onCancel: () => void;
}

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-[--color-accent] text-white'
          : 'bg-[--color-surface] text-[--color-text-secondary] border border-[--color-border]'
      }`}
    >
      {label}
    </button>
  );
}

function StepperButton({ value, min, max, step = 1, unit, onChange }: {
  value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[--color-border] bg-[--color-surface] text-xl font-bold"
      >
        −
      </button>
      <span className="min-w-[80px] text-center text-lg font-bold">
        {value} {unit}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[--color-border] bg-[--color-surface] text-xl font-bold"
      >
        +
      </button>
    </div>
  );
}

export function ProfileEditForm({ profile, onSave, onCancel }: Props) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [goal, setGoal] = useState<TrainingGoal>(profile.training_goal);
  const [level, setLevel] = useState<TrainingLevel>(profile.training_level);
  const [split, setSplit] = useState<PreferredSplit>(profile.preferred_split);
  const [daysPerWeek, setDaysPerWeek] = useState(profile.training_days_per_week);
  const [sessionMinutes, setSessionMinutes] = useState(profile.avg_session_minutes);
  const [weightKg, setWeightKg] = useState<number | ''>(profile.weight_kg ?? '');
  const [heightCm, setHeightCm] = useState<number | ''>(profile.height_cm ?? '');
  const [age, setAge] = useState<number | ''>(profile.age ?? '');
  const [gymPref, setGymPref] = useState<GymPreference>(profile.gym_preference ?? 'gym');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!displayName.trim()) { setError('Naam mag niet leeg zijn.'); return; }
    setSaving(true);
    setError('');

    const supabase = createClient();
    const updates = {
      display_name: displayName.trim(),
      training_goal: goal,
      training_level: level,
      preferred_split: split,
      training_days_per_week: daysPerWeek,
      avg_session_minutes: sessionMinutes,
      weight_kg: weightKg !== '' ? Number(weightKg) : null,
      height_cm: heightCm !== '' ? Number(heightCm) : null,
      age: age !== '' ? Number(age) : null,
      gym_preference: gymPref,
    };

    const { data, error: err } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single();

    if (err || !data) {
      setError('Opslaan mislukt. Probeer opnieuw.');
      setSaving(false);
      return;
    }

    onSave(data as Profile);
  }

  return (
    <div className="px-4 pt-5 pb-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Profiel bewerken</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Naam */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Naam</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none"
          />
        </div>

        {/* Trainingsdoel */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Trainingsdoel</label>
          <div className="flex flex-wrap gap-2">
            {(['muscle_building', 'strength', 'cut', 'maintenance'] as TrainingGoal[]).map((g) => (
              <OptionButton
                key={g}
                label={g === 'muscle_building' ? 'Spieropbouw' : g === 'strength' ? 'Kracht' : g === 'cut' ? 'Cut' : 'Onderhoud'}
                active={goal === g}
                onClick={() => setGoal(g)}
              />
            ))}
          </div>
        </div>

        {/* Niveau */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Niveau</label>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as TrainingLevel[]).map((l) => (
              <OptionButton
                key={l}
                label={l === 'beginner' ? 'Beginner' : l === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                active={level === l}
                onClick={() => setLevel(l)}
              />
            ))}
          </div>
        </div>

        {/* Split */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Trainingsschema</label>
          <div className="flex flex-wrap gap-2">
            {(['ppl', 'upper_lower', 'full_body', 'custom'] as PreferredSplit[]).map((s) => (
              <OptionButton
                key={s}
                label={s === 'ppl' ? 'PPL' : s === 'upper_lower' ? 'Upper/Lower' : s === 'full_body' ? 'Full Body' : 'Custom'}
                active={split === s}
                onClick={() => setSplit(s)}
              />
            ))}
          </div>
        </div>

        {/* Gym voorkeur */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Gym voorkeur</label>
          <div className="flex gap-2">
            {(['gym', 'home', 'both'] as GymPreference[]).map((g) => (
              <OptionButton
                key={g}
                label={g === 'gym' ? 'Gym' : g === 'home' ? 'Thuis' : 'Beide'}
                active={gymPref === g}
                onClick={() => setGymPref(g)}
              />
            ))}
          </div>
        </div>

        {/* Dagen per week */}
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Trainingsdagen per week</label>
          <StepperButton value={daysPerWeek} min={1} max={7} unit="dagen" onChange={setDaysPerWeek} />
        </div>

        {/* Sessieduur */}
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Gemiddelde sessieduur</label>
          <StepperButton value={sessionMinutes} min={15} max={180} step={15} unit="min" onChange={setSessionMinutes} />
        </div>

        {/* Gewicht / Lengte / Leeftijd */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Gewicht</label>
            <div className="relative">
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="70"
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-3 py-2.5 pr-8 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[--color-text-muted]">kg</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Lengte</label>
            <div className="relative">
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="175"
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-3 py-2.5 pr-8 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[--color-text-muted]">cm</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">Leeftijd</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="20"
              className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-3 py-2.5 text-sm text-[--color-text] focus:border-[--color-accent] focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-[--color-red]">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[--color-border] bg-[--color-surface] py-3 text-sm font-medium text-[--color-text-secondary]"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[--color-accent] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
