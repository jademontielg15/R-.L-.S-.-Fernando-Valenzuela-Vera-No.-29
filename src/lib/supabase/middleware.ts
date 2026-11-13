import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

function redirectWithCookies(request: NextRequest, response: NextResponse, destination: string) {
  const redirectResponse = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isAdminLogin = pathname === '/admin/login';
  const isProtectedAdminRoute =
    pathname === '/admin' || (pathname.startsWith('/admin/') && !isAdminLogin);

  if (!supabaseUrl || !supabaseAnonKey) {
    return isProtectedAdminRoute
      ? redirectWithCookies(request, response, '/admin/login')
      : response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    }
  );

  if (!isProtectedAdminRoute) {
    await supabase.auth.getSession();
    return response;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error verificando acceso al panel:', userError.message);
  }
  if (userError || !user) {
    return redirectWithCookies(request, response, '/admin/login');
  }

  const { data: adminUser, error: roleError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleError) {
    console.error('Error verificando rol administrativo:', roleError.message);
    return redirectWithCookies(request, response, '/admin/login');
  }
  if (!adminUser) {
    return redirectWithCookies(request, response, '/admin/login');
  }

  return response;
}
