'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

function getLoginErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';
  const name =
    typeof error === 'object' && error !== null && 'name' in error &&
    typeof error.name === 'string'
      ? error.name
      : '';

  if (code === 'invalid_credentials') {
    return 'El correo o la contraseña no son correctos.';
  }
  if (code === 'email_not_confirmed') {
    return 'Confirma el correo electrónico de la cuenta antes de iniciar sesión.';
  }
  if (name === 'AuthRetryableFetchError') {
    return 'No fue posible conectar con el servicio de autenticación. Revisa tu conexión e inténtalo de nuevo.';
  }
  return 'Ocurrió un problema al iniciar sesión. Inténtalo de nuevo.';
}

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
        console.error('Error de inicio de sesión administrativo:', signInError.code);
        setError(getLoginErrorMessage(signInError));
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error verificando la sesión administrativa:', userError.code);
        setError('No fue posible verificar la sesión. Inténtalo de nuevo.');
        return;
      }
      if (!user) {
        setError('No fue posible verificar la sesión. Inténtalo de nuevo.');
        return;
      }

      const { data: adminUser, error: roleError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error verificando permisos administrativos:', roleError.code);
        setError('No fue posible verificar los permisos de esta cuenta. Inténtalo de nuevo.');
        return;
      }
      if (!adminUser) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error al cerrar sesión de una cuenta no autorizada:', signOutError.code);
        }
        setError('Esta cuenta no está autorizada para acceder al panel.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err &&
        typeof err.code === 'string'
          ? err.code
          : undefined;
      console.error('Error inesperado al iniciar sesión:', code ?? 'sin código');
      setError(getLoginErrorMessage(err));
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
            <h1 className="mt-3 font-serif text-2xl text-navy-800">FVV29</h1>
            <p className="mt-2 text-sm text-content-muted">Acceso restringido a administradores</p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
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
            El acceso administrativo requiere autorización. Para la primera cuenta, crea una cuenta normal en{' '}
            <Link href="/registro" className="font-medium text-navy-800 underline underline-offset-4">
              Registro
            </Link>{' '}
            y solicita al operador de confianza que la autorice. Después, un superadministrador podrá invitar
            otras cuentas.
          </p>
        </Card>
      </div>
    </div>
  );
}
