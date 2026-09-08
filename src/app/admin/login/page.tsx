'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Login exitoso, redirigir al dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="p-8">
          <div className="border-b border-line-subtle pb-6">
            <p className="text-eyebrow uppercase text-gold-700">Panel de Administración</p>
            <h1 className="mt-3 font-serif text-2xl text-navy-800">MRGLVM</h1>
            <p className="mt-2 text-sm text-content-muted">Acceso restringido a administradores</p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mrglvm.mx"
              autoComplete="email"
              required
              disabled={loading}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />

            {error && (
              <div
                role="alert"
                className="rounded border border-danger/30 bg-danger-soft p-3.5 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <p className="mt-7 border-t border-line-subtle pt-5 text-sm leading-relaxed text-content-muted">
            Para acceder, necesitas credenciales de administrador. Contacta al responsable del sitio
            si olvidaste tu contraseña.
          </p>
        </Card>
      </div>
    </div>
  );
}
