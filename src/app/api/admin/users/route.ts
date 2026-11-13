import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERS_PER_PAGE = 1000;

async function findAuthUserByEmail(
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

export async function GET() {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Se requiere una sesión administrativa.' }, { status: 401 });
    }
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json({ error: 'No tienes permiso para administrar cuentas.' }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: admins, error: adminsError } = await adminClient
      .from('admin_users')
      .select('user_id, role, created_at')
      .order('created_at', { ascending: true });

    if (adminsError) throw adminsError;

    const authUsers = new Map<string, { email: string; confirmed: boolean }>();
    for (let page = 1; ; page++) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage: USERS_PER_PAGE,
      });

      if (error) throw error;

      data.users.forEach((user) => {
        if (user.email) {
          authUsers.set(user.id, {
            email: user.email,
            confirmed: Boolean(user.email_confirmed_at),
          });
        }
      });
      if (data.users.length < USERS_PER_PAGE) break;
    }

    return NextResponse.json({
      users: admins.map((admin) => ({
        id: admin.user_id,
        email: authUsers.get(admin.user_id)?.email || 'Correo no disponible',
        confirmed: authUsers.get(admin.user_id)?.confirmed || false,
        role: admin.role,
        createdAt: admin.created_at,
      })),
    });
  } catch (error) {
    console.error('Error al listar cuentas administrativas:', error);
    return NextResponse.json({ error: 'No fue posible cargar las cuentas.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Se requiere una sesión administrativa.' }, { status: 401 });
    }
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json({ error: 'No tienes permiso para crear cuentas.' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'El contenido de la solicitud no es válido.' }, { status: 400 });
    }
    if (
      typeof body !== 'object' ||
      body === null ||
      !('email' in body) ||
      !('role' in body) ||
      typeof body.email !== 'string' ||
      typeof body.role !== 'string'
    ) {
      return NextResponse.json({ error: 'Indica un correo y un rol válidos.' }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const role = body.role;
    if (!EMAIL_PATTERN.test(email) || (role !== 'admin' && role !== 'super_admin')) {
      return NextResponse.json({ error: 'Indica un correo y un rol válidos.' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    let user = await findAuthUserByEmail(adminClient, email);
    let invited = false;

    if (user && !user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'La cuenta ya existe, pero su correo aún no está confirmado.' },
        { status: 409 }
      );
    }

    if (!user) {
      const redirectTo = new URL(
        '/auth/callback?next=/admin/activar-cuenta',
        SITE_URL
      ).toString();
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo });
      if (error) throw error;
      if (!data.user) {
        throw new Error('Supabase no devolvió el usuario invitado.');
      }

      user = data.user;
      invited = true;
    }

    if (user.id === currentAdmin.user.id && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'No puedes quitarte el rol de superadministrador desde tu propia cuenta.' },
        { status: 409 }
      );
    }

    const { data: existingRole, error: existingRoleError } = await adminClient
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingRoleError) throw existingRoleError;
    if (existingRole?.role === 'super_admin' && role === 'admin') {
      const { count, error: countError } = await adminClient
        .from('admin_users')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'super_admin');

      if (countError) throw countError;
      if ((count || 0) <= 1) {
        return NextResponse.json(
          { error: 'No se puede degradar al único superadministrador.' },
          { status: 409 }
        );
      }
    }

    const { error: roleError } = await adminClient.from('admin_users').upsert(
      { user_id: user.id, role },
      { onConflict: 'user_id' }
    );

    if (roleError) {
      if (invited) {
        const { error: cleanupError } = await adminClient.auth.admin.deleteUser(user.id);
        if (cleanupError) {
          console.error('No se pudo cancelar la invitación sin rol administrativo:', cleanupError.code);
        }
      }
      throw roleError;
    }

    return NextResponse.json(
      {
        success: true,
        message: invited
          ? 'Invitación enviada. La cuenta tendrá acceso al confirmar el correo y establecer su contraseña.'
          : 'El rol de la cuenta fue actualizado.',
      },
      { status: invited ? 201 : 200 }
    );
  } catch (error) {
    console.error('Error al crear cuenta administrativa:', error);
    return NextResponse.json({ error: 'No fue posible crear o actualizar la cuenta.' }, { status: 500 });
  }
}
