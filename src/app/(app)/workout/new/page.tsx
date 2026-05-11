import { createClient } from '@/lib/supabase/server';
import { WorkoutLoggerContent } from '@/components/workout/workout-logger-content';

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { template: templateId } = await searchParams;

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

  // Fetch template if provided
  let template = null;
  if (templateId) {
    const { data } = await supabase
      .from('workout_templates')
      .select(`
        *,
        workout_template_exercises (
          *,
          exercise:exercises (id, name),
          sets:workout_template_sets (*)
        )
      `)
      .eq('id', templateId)
      .eq('user_id', user!.id)
      .single();
    template = data;
  }

  return (
    <WorkoutLoggerContent
      userId={user!.id}
      exercises={exercises}
      recentSets={recentSets ?? []}
      template={template}
    />
  );
}
