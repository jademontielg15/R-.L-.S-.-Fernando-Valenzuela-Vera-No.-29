import { NextRequest, NextResponse } from 'next/server';
import { findAuthUserByEmail } from '@/lib/admin/users';
import { hashAdminRegistrationCode } from '@/lib/admin/registration-code';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'La solicitud no es válida.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    !('code' in body) ||
    typeof body.email !== 'string' ||
    typeof body.code !== 'string'
  ) {
    return NextResponse.json({ error: 'Indica el correo y el código de alta.' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const registrationCode = body.code.trim();
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || registrationCode.length < 32 || registrationCode.length > 128) {
    return NextResponse.json({ error: 'El correo o el código no son válidos.' }, { status: 400 });
  }

  try {
    const adminClient = createAdminClient();
    const existingUser = await findAuthUserByEmail(adminClient, email);

    if (existingUser && !existingUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Confirma primero el correo de la cuenta y vuelve a usar el código.' },
        { status: 409 }
      );
    }

    if (existingUser) {
      const { data: existingRole, error: roleLookupError } = await adminClient
        .from('admin_users')
        .select('role')
        .eq('user_id', existingUser.id)
        .maybeSingle();

      if (roleLookupError) throw roleLookupError;
      if (existingRole) {
        return NextResponse.json(
          { error: 'Esta cuenta ya tiene acceso administrativo.' },
          { status: 409 }
        );
      }
    }

    const tokenHash = hashAdminRegistrationCode(registrationCode);
    const claimedAt = new Date().toISOString();
    const { data: claimedCode, error: claimError } = await adminClient
      .from('admin_registration_codes')
      .update({ used_at: claimedAt })
      .eq('token_hash', tokenHash)
      .eq('email', email)
      .is('used_at', null)
      .gt('expires_at', claimedAt)
      .select('token_hash')
      .maybeSingle();

    if (claimError) throw claimError;
    if (!claimedCode) {
      return NextResponse.json(
        { error: 'El código no es válido, venció o ya fue utilizado para ese correo.' },
        { status: 400 }
      );
    }

    let invitedUserId: string | null = null;
    try {
      let userId = existingUser?.id;

      if (!userId) {
        const redirectTo = new URL('/auth/callback?next=/admin/activar-cuenta', SITE_URL).toString();
        const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo });
        if (error) throw error;
        if (!data.user) throw new Error('Supabase no devolvió el usuario invitado.');

        userId = data.user.id;
        invitedUserId = userId;
      }

      const { error: roleInsertError } = await adminClient
        .from('admin_users')
        .insert({ user_id: userId, role: 'admin' });

      if (roleInsertError) throw roleInsertError;

      return NextResponse.json({
        success: true,
        invited: Boolean(invitedUserId),
        message: invitedUserId
          ? 'Código aceptado. Revisa el correo para activar la cuenta y establecer la contraseña.'
          : 'Código aceptado. Ya puedes iniciar sesión con tu cuenta.',
      });
    } catch (error) {
      let canReleaseCode = !invitedUserId;
      if (invitedUserId) {
        const { error: cleanupError } = await adminClient.auth.admin.deleteUser(invitedUserId);
        if (cleanupError) {
          console.error('No se pudo cancelar la invitación sin rol:', cleanupError.code);
        } else {
          canReleaseCode = true;
        }
      }

      if (canReleaseCode) {
        const { error: releaseError } = await adminClient
          .from('admin_registration_codes')
          .update({ used_at: null })
          .eq('token_hash', tokenHash)
          .eq('used_at', claimedAt);

        if (releaseError) {
          console.error('No se pudo liberar el código de alta:', releaseError.code);
        }
      }

      throw error;
    }
  } catch (error) {
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error &&
      typeof error.code === 'string'
        ? error.code
        : error instanceof Error
          ? error.name
          : 'unknown';
    console.error('Error al registrar cuenta administrativa:', errorCode);
    return NextResponse.json(
      { error: 'No fue posible completar el registro. Verifica la migración y vuelve a intentarlo.' },
      { status: 500 }
    );
  }
}
