'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Minus, Plus, Loader2 } from 'lucide-react';
import type { TrainingGoal, TrainingLevel, PreferredSplit } from '@/types/database';

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

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<TrainingGoal | null>(null);
  const [level, setLevel] = useState<TrainingLevel | null>(null);
  const [split, setSplit] = useState<PreferredSplit | null>(null);
  const [days, setDays] = useState(4);
  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const canProceed =
    (step === 0 && goal) ||
    (step === 1 && level) ||
    (step === 2 && split) ||
    step === 3;

  async function handleComplete() {
    if (!goal || !level || !split) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        training_goal: goal,
        training_level: level,
        preferred_split: split,
        training_days_per_week: days,
        avg_session_minutes: sessionMinutes,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pt-12 pb-8">
      {/* Step indicators */}
      <div className="mb-6 flex justify-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-6 bg-[--color-accent]' : i < step ? 'w-2 bg-[--color-accent]/60' : 'w-2 bg-[--color-border]'
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        {/* Step 0: Goal */}
        {step === 0 && (
          <>
            <h1 className="mb-1 text-[22px] font-bold">Wat is je doel?</h1>
            <p className="mb-4 text-sm text-[--color-text-secondary]">Dit bepaalt hoe de app je advies geeft</p>
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
          </>
        )}

        {/* Step 1: Level */}
        {step === 1 && (
          <>
            <h1 className="mb-1 text-[22px] font-bold">Trainingsniveau</h1>
            <p className="mb-4 text-sm text-[--color-text-secondary]">Helpt bij het inschatten van herstel</p>
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
          </>
        )}

        {/* Step 2: Split */}
        {step === 2 && (
          <>
            <h1 className="mb-1 text-[22px] font-bold">Voorkeursplit</h1>
            <p className="mb-4 text-sm text-[--color-text-secondary]">Hoe deel je je trainingen in?</p>
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
          </>
        )}

        {/* Step 3: Frequency */}
        {step === 3 && (
          <>
            <h1 className="mb-1 text-[22px] font-bold">Trainingsfrequentie</h1>
            <p className="mb-4 text-sm text-[--color-text-secondary]">Hoeveel dagen per week train je gemiddeld?</p>

            <div className="mb-6 rounded-xl border border-[--color-border] bg-[--color-card] p-6 text-center">
              <div className="flex items-center justify-center gap-6">
                <StepperButton onClick={() => setDays(Math.max(1, days - 1))} icon={<Minus size={18} />} />
                <div>
                  <div className="text-5xl font-extrabold text-[--color-accent]">{days}</div>
                  <div className="text-sm text-[--color-text-secondary]">dagen per week</div>
                </div>
                <StepperButton onClick={() => setDays(Math.min(7, days + 1))} icon={<Plus size={18} />} />
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((d, i) => (
                  <div
                    key={d}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-medium transition-all ${
                      i < days
                        ? 'bg-[--color-accent] text-white'
                        : 'border border-[--color-border] bg-[--color-surface] text-[--color-text-muted]'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-4">
              <label className="mb-2 block text-sm font-medium">
                Gemiddelde sessieduur
              </label>
              <div className="flex items-center gap-4">
                <StepperButton onClick={() => setSessionMinutes(Math.max(15, sessionMinutes - 15))} icon={<Minus size={16} />} />
                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold text-[--color-accent]">{sessionMinutes}</span>
                  <span className="ml-1 text-sm text-[--color-text-secondary]">min</span>
                </div>
                <StepperButton onClick={() => setSessionMinutes(Math.min(180, sessionMinutes + 15))} icon={<Plus size={16} />} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex gap-2.5">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3.5 text-[15px] font-medium"
          >
            Terug
          </button>
        )}
        <button
          onClick={() => {
            if (step < 3) setStep(step + 1);
            else handleComplete();
          }}
          disabled={!canProceed || loading}
          className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[--color-accent] px-4 py-3.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {step === 3 ? 'Start met TrainReady →' : 'Volgende'}
        </button>
      </div>
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
