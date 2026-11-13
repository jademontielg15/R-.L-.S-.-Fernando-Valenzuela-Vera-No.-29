'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/lib/admin/types';
import type { User } from '@supabase/supabase-js';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/documentos/nuevo', label: 'Subir Documento', exact: false },
  { href: '/admin/imagenes', label: 'Galería', exact: false },
  { href: '/admin/solicitudes', label: 'Solicitudes', exact: false },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const isPublicAuthRoute = pathname === '/admin/login' || pathname === '/admin/registro';

  useEffect(() => {
    if (isPublicAuthRoute) {
      setUser(null);
      setRole(null);
      return;
    }

    let active = true;
    setUser(null);
    setRole(null);
    setLoading(true);

    const checkSession = async () => {
      try {
        const {
          data: { user: authenticatedUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!authenticatedUser) {
          if (active) router.replace('/admin/login');
          return;
        }

        const { data: adminUser, error: roleError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', authenticatedUser.id)
          .maybeSingle();

        if (roleError) throw roleError;
        if (!adminUser) {
          await supabase.auth.signOut();
          if (active) router.replace('/admin/login');
          return;
        }

        if (!active) return;
        setUser(authenticatedUser);
        setRole(adminUser.role as AdminRole);
      } catch (error) {
        console.error('Session check error:', error);
        if (active) router.replace('/admin/login');
      } finally {
        if (active) setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && active) {
        router.replace('/');
        router.refresh();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isPublicAuthRoute, router, supabase]);

  const handleLogout = async () => {
    setLogoutError(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión administrativa:', error.message);
      setLogoutError('No fue posible cerrar la sesión. Inténtalo de nuevo.');
      return;
    }

    router.replace('/');
    router.refresh();
  };

  if (isPublicAuthRoute) {
    return <>{children}</>;
  }

  if (loading || !user || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <p className="text-sm text-content-secondary">Verificando sesión...</p>
      </div>
    );
  }

  if (role !== 'super_admin' && pathname.startsWith('/admin/usuarios')) {
    return (
      <div className="min-h-screen bg-surface-page">
        <main className="container mx-auto px-4 py-10">
          <p role="alert" className="text-sm text-danger">
            No tienes permiso para administrar cuentas.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="on-inverse bg-navy-900 text-content-inverse">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/admin"
            className="font-serif text-xl font-semibold tracking-[-0.02em] transition-colors duration-hover ease-out hover:text-gold-300"
          >
            FVV29 <span className="text-gold-400">Administración</span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-navy-200 sm:inline">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
        {logoutError && (
          <p role="alert" className="container mx-auto px-4 pb-3 text-sm text-danger">
            {logoutError}
          </p>
        )}

        {/* `bg-opacity-80` sobre el mismo color que el padre no producía ningún
            cambio visible: la barra de navegación se fundía con la cabecera. */}
        <nav aria-label="Administración" className="border-t border-navy-700/60 bg-navy-950">
          <div className="container mx-auto flex flex-wrap items-center gap-1 px-4">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative py-3.5 pr-5 text-sm transition-colors duration-hover ease-out',
                    'after:absolute after:inset-x-0 after:bottom-0 after:mr-5 after:h-px after:bg-gold-400',
                    active
                      ? 'text-content-inverse after:scale-x-100'
                      : 'text-navy-200 after:scale-x-0 hover:text-content-inverse'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {role === 'super_admin' && (
              <Link
                href="/admin/usuarios"
                aria-current={pathname.startsWith('/admin/usuarios') ? 'page' : undefined}
                className={cn(
                  'relative py-3.5 pr-5 text-sm transition-colors duration-hover ease-out',
                  'after:absolute after:inset-x-0 after:bottom-0 after:mr-5 after:h-px after:bg-gold-400',
                  pathname.startsWith('/admin/usuarios')
                    ? 'text-content-inverse after:scale-x-100'
                    : 'text-navy-200 after:scale-x-0 hover:text-content-inverse'
                )}
              >
                Administrar cuentas
              </Link>
            )}
            <Link
              href="/"
              className="ml-auto py-3.5 text-sm text-navy-200 transition-colors duration-hover ease-out hover:text-content-inverse"
            >
              Ver Sitio
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
