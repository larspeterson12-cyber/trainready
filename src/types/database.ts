// ============================================================
// TrainReady Database Types
// In productie: genereer deze met `supabase gen types typescript`
// ============================================================

export type TrainingGoal = 'muscle_building' | 'strength' | 'cut' | 'maintenance';
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type PreferredSplit = 'ppl' | 'upper_lower' | 'full_body' | 'custom';
export type GymPreference = 'gym' | 'home' | 'both';
export type ExerciseCategory = 'compound' | 'isolation';
export type EquipmentType = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'other';
export type MuscleInvolvement = 'primary' | 'secondary';
export type WorkoutType = 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body' | 'custom';

export type MuscleGroupName =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'quadriceps' | 'hamstrings' | 'glutes' | 'calves' | 'core';

export interface Profile {
  id: string;
  display_name: string;
  training_goal: TrainingGoal;
  training_level: TrainingLevel;
  preferred_split: PreferredSplit;
  training_days_per_week: number;
  avg_session_minutes: number;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  gym_preference: GymPreference;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroup {
  id: string;
  name: MuscleGroupName;
  display_name: string;
  category: 'small' | 'medium' | 'large';
  decay_rate: number;
  display_order: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: EquipmentType | null;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
}

export interface ExerciseMuscleGroup {
  id: string;
  exercise_id: string;
  muscle_group_id: string;
  involvement: MuscleInvolvement;
  weight: number;
}

export interface Workout {
  id: string;
  user_id: string;
  date: string;
  workout_type: WorkoutType;
  duration_minutes: number | null;
  session_rpe: number | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  notes: string | null;
}

export interface WorkoutSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  rir: number | null;
  completed: boolean;
  created_at: string;
}

export interface MuscleFatigueLog {
  id: string;
  user_id: string;
  muscle_group_id: string;
  workout_id: string;
  fatigue_points: number;
  logged_at: string;
}

// ============================================================
// Derived / Computed Types
// ============================================================

export interface RecoveryScore {
  muscleGroupId: string;
  muscleGroupName: MuscleGroupName;
  displayName: string;
  score: number; // 0-100
  status: 'recovered' | 'partial' | 'fatigued';
  lastTrainedAt: string | null;
}

export interface ExerciseWithMuscleGroups extends Exercise {
  muscle_groups: (ExerciseMuscleGroup & {
    muscle_group: MuscleGroup;
  })[];
}

export interface WorkoutWithDetails extends Workout {
  exercises: (WorkoutExercise & {
    exercise: Exercise;
    sets: WorkoutSet[];
  })[];
}

export type TrainingAdviceIntensity = 'light' | 'normal' | 'heavy';

export interface TrainingAdvice {
  recommendedSplit: WorkoutType | 'rest';
  splitDisplayName: string;
  reason: string;
  intensity: TrainingAdviceIntensity;
  estimatedDuration: number;
  suggestedExerciseCount: number;
  alternativeSplit?: WorkoutType;
  alternativeReason?: string;
  isRestDay: boolean;
  restReason?: string;
  readinessScore: number;
}
