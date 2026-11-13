import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export const USERS_PER_PAGE = 1000;

export async function findAuthUserByEmail(
  adminClient: ReturnType<typeof createAdminClient>,
  email: string
) {
  for (let page = 1; ; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: USERS_PER_PAGE,
    });

    if (error) throw error;

    const user = data.users.find((item) => item.email?.toLowerCase() === email);
    if (user) return user;
    if (data.users.length < USERS_PER_PAGE) return null;
  }
}
