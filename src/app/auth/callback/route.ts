import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const nextPath =
    request.nextUrl.searchParams.get('next') === '/admin/activar-cuenta'
      ? '/admin/activar-cuenta'
      : '/admin';

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?error=invitacion', request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error al aceptar invitación administrativa:', error.message);
    return NextResponse.redirect(new URL('/admin/login?error=invitacion', request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
