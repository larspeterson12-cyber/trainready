import { createClient } from '@/lib/supabase/server';
import { WorkoutHistoryContent } from '@/components/workout/workout-history-content';

export default async function WorkoutHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: workouts } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        *,
        exercise:exercises (*),
        sets:workout_sets (*)
      )
    `)
    .eq('user_id', user!.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  return <WorkoutHistoryContent workouts={workouts ?? []} />;
}
