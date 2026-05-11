'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import { ProfileEditForm } from './profile-edit-form';

const GOAL_LABELS: Record<string, string> = {
  muscle_building: 'Spieropbouw',
  strength: 'Kracht',
  cut: 'Cut / Vetverlies',
  maintenance: 'Onderhoud',
};

const SPLIT_LABELS: Record<string, string> = {
  ppl: 'Push / Pull / Legs',
  upper_lower: 'Upper / Lower',
  full_body: 'Full Body',
  custom: 'Custom',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

interface ProfileContentProps {
  profile: Profile | null;
  totalWorkouts: number;
  weekWorkouts: number;
}

export function ProfileContent({ profile: initialProfile, totalWorkouts, weekWorkouts }: ProfileContentProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  function handleSave(updated: Profile) {
    setProfile(updated);
    setIsEditing(false);
    router.refresh();
  }

  if (!profile) return null;

  if (isEditing) {
    return (
      <ProfileEditForm
        profile={profile}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const initials = profile.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Profiel</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[--color-border] bg-[--color-surface] px-3 py-1.5 text-sm font-medium text-[--color-text-secondary] transition-colors hover:text-[--color-text]"
        >
          <Pencil size={14} />
          Bewerken
        </button>
      </div>

      {/* Avatar + Name */}
      <div className="mb-5 flex items-center gap-3.5 rounded-xl border border-[--color-border] bg-[--color-card] p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[--color-accent] text-[22px] font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-lg font-semibold">{profile.display_name}</div>
          <div className="text-sm text-[--color-text-secondary]">
            Lid sinds {new Date(profile.created_at).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        <StatCard label="Trainingen" value={String(totalWorkouts)} />
        <StatCard label="Deze week" value={String(weekWorkouts)} />
        <StatCard label="Dagen/week" value={String(profile.training_days_per_week)} />
      </div>

      {/* Settings list */}
      <div className="flex flex-col">
        <SettingRow label="Trainingsdoel" value={GOAL_LABELS[profile.training_goal] ?? profile.training_goal} />
        <SettingRow label="Split" value={SPLIT_LABELS[profile.preferred_split] ?? profile.preferred_split} />
        <SettingRow label="Niveau" value={LEVEL_LABELS[profile.training_level] ?? profile.training_level} />
        <SettingRow label="Sessieduur" value={`${profile.avg_session_minutes} min`} />
        {profile.weight_kg && <SettingRow label="Gewicht" value={`${profile.weight_kg} kg`} />}
        {profile.height_cm && <SettingRow label="Lengte" value={`${profile.height_cm} cm`} />}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm font-medium text-[--color-red] transition-colors hover:bg-red-500/5"
      >
        <LogOut size={16} />
        Uitloggen
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-3 text-center">
      <div className="text-2xl font-bold text-[--color-accent]">{value}</div>
      <div className="text-[11px] text-[--color-text-secondary]">{label}</div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[--color-border] py-3.5">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[--color-text-secondary]">{value}</span>
        <ChevronRight size={16} className="text-[--color-text-muted]" />
      </div>
    </div>
  );
}
