'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/documentos/nuevo', label: 'Subir Documento', exact: false },
  { href: '/admin/solicitudes', label: 'Solicitudes', exact: false },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/admin/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/admin/login');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <p className="text-sm text-content-secondary">Verificando sesión...</p>
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
            MRGLVM <span className="text-gold-400">Admin</span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-navy-200 sm:inline">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

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
