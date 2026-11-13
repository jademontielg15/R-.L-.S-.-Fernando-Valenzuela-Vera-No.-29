import { NextRequest, NextResponse } from 'next/server';
import { createAdminRegistrationCode, isValidRegistrationSetupSecret } from '@/lib/admin/registration-code';
import { createAdminClient } from '@/lib/supabase/admin';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_VALIDITY_HOURS = 48;
const MIN_SETUP_SECRET_LENGTH = 32;

export async function POST(request: NextRequest) {
  const setupSecret = process.env.ADMIN_REGISTRATION_SETUP_SECRET;
  if (!setupSecret || Buffer.byteLength(setupSecret) < MIN_SETUP_SECRET_LENGTH) {
    return NextResponse.json(
      { error: 'El servicio de códigos privados no está configurado.' },
      { status: 503 }
    );
  }

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
    !('setupSecret' in body) ||
    typeof body.email !== 'string' ||
    typeof body.setupSecret !== 'string'
  ) {
    return NextResponse.json({ error: 'Indica un correo y la clave privada.' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || body.setupSecret.length > 512) {
    return NextResponse.json({ error: 'Indica un correo y la clave privada válidos.' }, { status: 400 });
  }
  if (!isValidRegistrationSetupSecret(body.setupSecret, setupSecret)) {
    return NextResponse.json({ error: 'No fue posible autorizar la creación del código.' }, { status: 401 });
  }

  const { code, tokenHash } = createAdminRegistrationCode();
  const expiresAt = new Date(Date.now() + CODE_VALIDITY_HOURS * 60 * 60 * 1000);

  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.from('admin_registration_codes').insert({
      token_hash: tokenHash,
      email,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error('Error guardando código de alta administrativa:', error.code);
      return NextResponse.json({ error: 'No fue posible generar el código.' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, code, expiresAt: expiresAt.toISOString() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const code = error instanceof Error ? error.name : 'unknown';
    console.error('Error al generar código de alta administrativa:', code);
    return NextResponse.json({ error: 'No fue posible generar el código.' }, { status: 500 });
  }
}
