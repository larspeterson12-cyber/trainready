import { createClient } from '@/lib/supabase/server';
import { WorkoutTemplatesContent } from '@/components/workout/workout-templates-content';

export default async function WorkoutTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: templates }, { data: rawExercises }] = await Promise.all([
    supabase
      .from('workout_templates')
      .select(`
        *,
        workout_template_exercises (
          *,
          exercise:exercises (id, name),
          sets:workout_template_sets (*)
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('exercises')
      .select(`*, exercise_muscle_groups (*, muscle_group:muscle_groups (*))`)
      .order('name'),
  ]);

  const exercises = (rawExercises ?? []).map((ex: any) => ({
    ...ex,
    muscle_groups: ex.exercise_muscle_groups ?? [],
  }));

  return (
    <WorkoutTemplatesContent
      userId={user!.id}
      templates={templates ?? []}
      exercises={exercises}
    />
  );
}
