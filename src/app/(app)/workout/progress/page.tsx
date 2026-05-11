import { createClient } from '@/lib/supabase/server';
import { WorkoutProgressContent } from '@/components/workout/workout-progress-content';

export default async function WorkoutProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all logged sets with exercise info and workout date
  const { data: sets } = await supabase
    .from('workout_sets')
    .select(`
      id,
      reps,
      weight_kg,
      set_number,
      workout_exercise:workout_exercises (
        exercise:exercises (id, name),
        workout:workouts (id, date, user_id)
      )
    `)
    .gt('reps', 0)
    .order('set_number', { ascending: true });

  // Filter to only this user's sets and flatten
  const userSets = (sets ?? []).filter(
    (s: any) => s.workout_exercise?.workout?.user_id === user!.id
  );

  return <WorkoutProgressContent sets={userSets} />;
}
