import { createClient } from '@/lib/supabase/server';
import { RecoveryContent } from '@/components/recovery/recovery-content';

export default async function RecoveryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: muscleGroups } = await supabase
    .from('muscle_groups')
    .select('*')
    .order('display_order');

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: fatigueLogs } = await supabase
    .from('muscle_fatigue_logs')
    .select('*')
    .eq('user_id', user!.id)
    .gte('logged_at', fourteenDaysAgo.toISOString());

  return (
    <RecoveryContent
      muscleGroups={muscleGroups ?? []}
      fatigueLogs={fatigueLogs ?? []}
    />
  );
}
