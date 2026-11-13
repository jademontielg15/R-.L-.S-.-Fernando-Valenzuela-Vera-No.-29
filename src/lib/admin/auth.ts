import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/lib/admin/types';

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data: adminUser, error: roleError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleError) throw roleError;
  if (!adminUser) return null;

  return { supabase, user, role: adminUser.role as AdminRole };
}
