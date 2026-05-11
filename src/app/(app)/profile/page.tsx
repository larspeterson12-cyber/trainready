import { createClient } from '@/lib/supabase/server';
import { ProfileContent } from '@/components/profile/profile-content';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // Count total workouts
  const { count: workoutCount } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id);

  // Count workouts this week
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const { count: weekCount } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .gte('date', monday.toISOString().split('T')[0]);

  return (
    <ProfileContent
      profile={profile}
      totalWorkouts={workoutCount ?? 0}
      weekWorkouts={weekCount ?? 0}
    />
  );
}
