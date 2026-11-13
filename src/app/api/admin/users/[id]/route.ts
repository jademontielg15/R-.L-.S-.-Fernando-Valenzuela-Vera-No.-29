import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Se requiere una sesión administrativa.' }, { status: 401 });
    }
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json({ error: 'No tienes permiso para revocar cuentas.' }, { status: 403 });
    }

    const { id } = await params;
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: 'La cuenta indicada no es válida.' }, { status: 400 });
    }
    if (id === currentAdmin.user.id) {
      return NextResponse.json(
        { error: 'No puedes revocar tu propio acceso administrativo.' },
        { status: 409 }
      );
    }

    const adminClient = createAdminClient();
    const { data: target, error: targetError } = await adminClient
      .from('admin_users')
      .select('role')
      .eq('user_id', id)
      .maybeSingle();

    if (targetError) throw targetError;
    if (!target) {
      return NextResponse.json({ error: 'No se encontró la cuenta administrativa.' }, { status: 404 });
    }

    if (target.role === 'super_admin') {
      const { count, error: countError } = await adminClient
        .from('admin_users')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'super_admin');

      if (countError) throw countError;
      if ((count || 0) <= 1) {
        return NextResponse.json(
          { error: 'No se puede revocar al único superadministrador.' },
          { status: 409 }
        );
      }
    }

    const { error: deleteError } = await adminClient
      .from('admin_users')
      .delete()
      .eq('user_id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al revocar cuenta administrativa:', error);
    return NextResponse.json({ error: 'No fue posible revocar la cuenta.' }, { status: 500 });
  }
}
