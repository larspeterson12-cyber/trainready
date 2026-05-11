'use client';

import { useState } from 'react';
import { Check, Minus, Plus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, TrainingGoal, TrainingLevel, PreferredSplit, GymPreference } from '@/types/database';

const GOALS: { key: TrainingGoal; label: string; desc: string; icon: string }[] = [
  { key: 'muscle_building', label: 'Spieropbouw', desc: 'Meer spiermassa opbouwen', icon: '💪' },
  { key: 'strength', label: 'Kracht', desc: 'Sterker worden op hoofdliften', icon: '🏋️' },
  { key: 'cut', label: 'Cut / Vetverlies', desc: 'Vet verliezen, spieren behouden', icon: '🔥' },
  { key: 'maintenance', label: 'Onderhoud', desc: 'Huidige fysiek behouden', icon: '⚖️' },
];

const LEVELS: { key: TrainingLevel; label: string; desc: string }[] = [
  { key: 'beginner', label: 'Beginner', desc: 'Minder dan 1 jaar ervaring' },
  { key: 'intermediate', label: 'Intermediate', desc: '1-3 jaar consistent trainen' },
  { key: 'advanced', label: 'Advanced', desc: '3+ jaar serieuze training' },
];

const SPLITS: { key: PreferredSplit; label: string; desc: string }[] = [
  { key: 'ppl', label: 'Push / Pull / Legs', desc: 'Klassieke 3-daagse split' },
  { key: 'upper_lower', label: 'Upper / Lower', desc: 'Boven- en onderlichaam' },
  { key: 'full_body', label: 'Full Body', desc: 'Alles in één sessie' },
  { key: 'custom', label: 'Custom', desc: 'Eigen indeling' },
];

const GYM_PREFS: { key: GymPreference; label: string; desc: string; icon: string }[] = [
  { key: 'gym', label: 'Sportschool', desc: 'Volledig uitgeruste gym', icon: '🏋️' },
  { key: 'home', label: 'Thuis', desc: 'Thuistraining met beperkt materiaal', icon: '🏠' },
  { key: 'both', label: 'Beide', desc: 'Afwisselend thuis en gym', icon: '🔄' },
];

interface ProfileEditFormProps {
  profile: Profile;
  onSave: (updated: Profile) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ profile, onSave, onCancel }: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [goal, setGoal] = useState<TrainingGoal>(profile.training_goal);
  const [level, setLevel] = useState<TrainingLevel>(profile.training_level);
  const [split, setSplit] = useState<PreferredSplit>(profile.preferred_split);
  const [days, setDays] = useState(profile.training_days_per_week);
  const [sessionMinutes, setSessionMinutes] = useState(profile.avg_session_minutes);
  const [weightKg, setWeightKg] = useState(profile.weight_kg?.toString() ?? '');
  const [heightCm, setHeightCm] = useState(profile.height_cm?.toString() ?? '');
  const [age, setAge] = useState(profile.age?.toString() ?? '');
  const [gymPref, setGymPref] = useState<GymPreference>(profile.gym_preference);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!displayName.trim()) {
      setError('Naam mag niet leeg zijn.');
      return;
    }
    setError('');
    setLoading(true);

    const supabase = createClient();
    const updates = {
      display_name: displayName.trim(),
      training_goal: goal,
      training_level: level,
      preferred_split: split,
      training_days_per_week: days,
      avg_session_minutes: sessionMinutes,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      height_cm: heightCm ? parseInt(heightCm) : null,
      age: age ? parseInt(age) : null,
      gym_preference: gymPref,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    setLoading(false);

    if (dbError) {
      setError('Opslaan mislukt. Probeer het opnieuw.');
      return;
    }

    onSave({ ...profile, ...updates });
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="mb-5 text-[22px] font-bold">Profiel bewerken</h1>

      {/* Naam */}
      <Section title="Naam">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Jouw naam"
          className="w-full rounded-xl border border-[--color-border] bg-[--color-card] px-4 py-3 text-[15px] text-[--color-text] placeholder:text-[--color-text-muted] outline-none focus:border-[--color-accent]"
        />
      </Section>

      {/* Trainingsdoel */}
      <Section title="Trainingsdoel">
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <OptionButton
              key={g.key}
              selected={goal === g.key}
              onClick={() => setGoal(g.key)}
              icon={g.icon}
              label={g.label}
              desc={g.desc}
            />
          ))}
        </div>
      </Section>

      {/* Niveau */}
      <Section title="Trainingsniveau">
        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => (
            <OptionButton
              key={l.key}
              selected={level === l.key}
              onClick={() => setLevel(l.key)}
              label={l.label}
              desc={l.desc}
            />
          ))}
        </div>
      </Section>

      {/* Split */}
      <Section title="Voorkeursplit">
        <div className="flex flex-col gap-2">
          {SPLITS.map((s) => (
            <OptionButton
              key={s.key}
              selected={split === s.key}
              onClick={() => setSplit(s.key)}
              label={s.label}
              desc={s.desc}
            />
          ))}
        </div>
      </Section>

      {/* Frequentie + sessieduur */}
      <Section title="Frequentie & sessieduur">
        <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-4 mb-3">
          <label className="mb-3 block text-sm font-medium">Dagen per week</label>
          <div className="flex items-center gap-4">
            <StepperButton onClick={() => setDays(Math.max(1, days - 1))} icon={<Minus size={16} />} />
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-[--color-accent]">{days}</span>
              <span className="ml-1 text-sm text-[--color-text-secondary]">dagen</span>
            </div>
            <StepperButton onClick={() => setDays(Math.min(7, days + 1))} icon={<Plus size={16} />} />
          </div>
        </div>
        <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-4">
          <label className="mb-3 block text-sm font-medium">Gemiddelde sessieduur</label>
          <div className="flex items-center gap-4">
            <StepperButton onClick={() => setSessionMinutes(Math.max(15, sessionMinutes - 15))} icon={<Minus size={16} />} />
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-[--color-accent]">{sessionMinutes}</span>
              <span className="ml-1 text-sm text-[--color-text-secondary]">min</span>
            </div>
            <StepperButton onClick={() => setSessionMinutes(Math.min(180, sessionMinutes + 15))} icon={<Plus size={16} />} />
          </div>
        </div>
      </Section>

      {/* Gym voorkeur */}
      <Section title="Gym voorkeur">
        <div className="flex flex-col gap-2">
          {GYM_PREFS.map((g) => (
            <OptionButton
              key={g.key}
              selected={gymPref === g.key}
              onClick={() => setGymPref(g.key)}
              icon={g.icon}
              label={g.label}
              desc={g.desc}
            />
          ))}
        </div>
      </Section>

      {/* Optionele lichaamsmaten */}
      <Section title="Lichaamsgegevens (optioneel)">
        <div className="flex flex-col gap-3">
          <NumberInput
            label="Leeftijd"
            unit="jaar"
            value={age}
            onChange={setAge}
            min={14}
            max={100}
          />
          <NumberInput
            label="Gewicht"
            unit="kg"
            value={weightKg}
            onChange={setWeightKg}
            min={30}
            max={300}
            step={0.1}
          />
          <NumberInput
            label="Lengte"
            unit="cm"
            value={heightCm}
            onChange={setHeightCm}
            min={100}
            max={250}
          />
        </div>
      </Section>

      {/* Error */}
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-[--color-red]">{error}</p>
      )}

      {/* Knoppen */}
      <div className="mt-2 flex gap-2.5">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3.5 text-[15px] font-medium transition-opacity disabled:opacity-40"
        >
          Annuleren
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[--color-accent] px-4 py-3.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Opslaan
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-[--color-text-secondary]">{title}</h2>
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  icon,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all ${
        selected
          ? 'border-2 border-[--color-accent] bg-[--color-accent]/10'
          : 'border border-[--color-border] bg-[--color-card]'
      }`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="flex-1">
        <div className="text-[15px] font-semibold">{label}</div>
        <div className="mt-0.5 text-xs text-[--color-text-secondary]">{desc}</div>
      </div>
      {selected && <Check size={18} className="text-[--color-accent]" />}
    </button>
  );
}

function StepperButton({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[--color-border] bg-[--color-surface] text-[--color-text] transition-colors hover:bg-[--color-card]"
    >
      {icon}
    </button>
  );
}

function NumberInput({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[--color-border] bg-[--color-card] px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder="—"
          className="w-20 rounded-lg border border-[--color-border] bg-[--color-surface] px-3 py-1.5 text-right text-sm text-[--color-text] outline-none focus:border-[--color-accent] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-sm text-[--color-text-secondary]">{unit}</span>
      </div>
    </div>
  );
}
