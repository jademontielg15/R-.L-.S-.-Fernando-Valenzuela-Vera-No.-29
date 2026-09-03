'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-institucional-primario text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-4">
            <h1 className="font-serif text-2xl font-bold">MRGLVM Admin</h1>
          </Link>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-200">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-institucional-primario bg-opacity-80 border-t border-white border-opacity-20">
          <div className="container mx-auto px-4 flex gap-6 py-3">
            <Link
              href="/admin"
              className="text-white hover:text-institucional-secundario transition font-semibold text-sm"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/documentos/nuevo"
              className="text-white hover:text-institucional-secundario transition font-semibold text-sm"
            >
              ➕ Subir Documento
            </Link>
            <Link
              href="/admin/solicitudes"
              className="text-white hover:text-institucional-secundario transition font-semibold text-sm"
            >
              📋 Solicitudes
            </Link>
            <Link
              href="/"
              className="text-white hover:text-institucional-secundario transition font-semibold text-sm ml-auto"
            >
              👁️ Ver Sitio
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
