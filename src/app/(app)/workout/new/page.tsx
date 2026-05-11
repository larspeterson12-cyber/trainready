import { createClient } from '@/lib/supabase/server';
import { WorkoutLoggerContent } from '@/components/workout/workout-logger-content';

export default async function NewWorkoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch exercises with muscle group mappings
  const { data: rawExercises } = await supabase
    .from('exercises')
    .select(`
      *,
      exercise_muscle_groups (
        *,
        muscle_group:muscle_groups (*)
      )
    `)
    .order('name');

  // Map exercise_muscle_groups to muscle_groups for component compatibility
  const exercises = (rawExercises ?? []).map((ex: any) => ({
    ...ex,
    muscle_groups: ex.exercise_muscle_groups ?? [],
  }));

  // Fetch user's last workout per exercise for reference
  const { data: recentSets } = await supabase
    .from('workout_sets')
    .select(`
      *,
      workout_exercise:workout_exercises (
        exercise_id,
        workout:workouts (user_id, date)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <WorkoutLoggerContent
      userId={user!.id}
      exercises={exercises}
      recentSets={recentSets ?? []}
    />
  );
}
