import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // Fetch muscle groups
  const { data: muscleGroups } = await supabase
    .from('muscle_groups')
    .select('*')
    .order('display_order');

  // Fetch recent workouts (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: recentWorkouts } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', fourteenDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false });

  // Fetch fatigue logs (last 14 days)
  const { data: fatigueLogs } = await supabase
    .from('muscle_fatigue_logs')
    .select('*')
    .eq('user_id', user!.id)
    .gte('logged_at', fourteenDaysAgo.toISOString());

  return (
    <DashboardContent
      profile={profile}
      muscleGroups={muscleGroups ?? []}
      recentWorkouts={recentWorkouts ?? []}
      fatigueLogs={fatigueLogs ?? []}
    />
  );
}
