import type { MuscleGroupName, WorkoutType } from '@/types/database';

// ============================================================
// Recovery Constants
// ============================================================

/** Scale factor to normalize fatigue points to 0-100 range */
export const FATIGUE_SCALE_FACTOR = 10;

/** Maximum lookback period in days for fatigue calculations */
export const FATIGUE_LOOKBACK_DAYS = 14;

/** Recovery thresholds */
export const RECOVERY_THRESHOLDS = {
  RECOVERED: 70,    // 70-100: green, good to go
  PARTIAL: 40,      // 40-69: orange, train with caution
  FATIGUED: 0,      //  0-39: red, rest recommended
} as const;

/** Default decay rates per muscle group (exponential decay constant) */
export const DECAY_RATES: Record<MuscleGroupName, number> = {
  chest: 0.038,
  back: 0.038,
  shoulders: 0.040,
  biceps: 0.045,
  triceps: 0.045,
  quadriceps: 0.035,
  hamstrings: 0.035,
  glutes: 0.035,
  calves: 0.045,
  core: 0.040,
};

/** Split-to-muscle-group mapping */
export const SPLIT_MUSCLE_GROUPS: Record<
  Exclude<WorkoutType, 'custom'>,
  { primary: MuscleGroupName[]; secondary: MuscleGroupName[] }
> = {
  push: {
    primary: ['chest', 'shoulders'],
    secondary: ['triceps'],
  },
  pull: {
    primary: ['back'],
    secondary: ['biceps'],
  },
  legs: {
    primary: ['quadriceps', 'hamstrings', 'glutes'],
    secondary: ['calves'],
  },
  upper: {
    primary: ['chest', 'back', 'shoulders'],
    secondary: ['biceps', 'triceps'],
  },
  lower: {
    primary: ['quadriceps', 'hamstrings', 'glutes'],
    secondary: ['calves', 'core'],
  },
  full_body: {
    primary: ['chest', 'back', 'quadriceps', 'shoulders'],
    secondary: ['biceps', 'triceps', 'hamstrings', 'glutes', 'calves', 'core'],
  },
};

/** Display names for workout types (Dutch) */
export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  upper: 'Upper',
  lower: 'Lower',
  full_body: 'Full Body',
  custom: 'Custom',
};

/** Display names for muscle groups (Dutch) */
export const MUSCLE_GROUP_LABELS: Record<MuscleGroupName, string> = {
  chest: 'Borst',
  back: 'Rug',
  shoulders: 'Schouders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  glutes: 'Bilspieren',
  calves: 'Kuiten',
  core: 'Core',
};

/** Weekly split targets based on preferred split and training days */
export function getWeeklySplitTargets(
  split: Exclude<WorkoutType, 'custom'> | 'ppl' | 'upper_lower',
  daysPerWeek: number
): Record<string, number> {
  switch (split) {
    case 'ppl':
      if (daysPerWeek <= 3) return { push: 1, pull: 1, legs: 1 };
      if (daysPerWeek === 4) return { push: 1, pull: 1, legs: 1 }; // +1 recovery-based
      if (daysPerWeek === 5) return { push: 2, pull: 2, legs: 1 };
      return { push: 2, pull: 2, legs: 2 }; // 6-7
    case 'upper_lower':
      if (daysPerWeek <= 2) return { upper: 1, lower: 1 };
      if (daysPerWeek === 3) return { upper: 2, lower: 1 };
      if (daysPerWeek === 4) return { upper: 2, lower: 2 };
      return { upper: 3, lower: 2 }; // 5+
    case 'full_body':
      return { full_body: Math.min(daysPerWeek, 5) };
    default:
      return {};
  }
}
