'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function ActivarCuentaAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/admin/login');
        return;
      }

      setCheckingSession(false);
    };

    void checkSession();
  }, [router, supabase]);

  const activateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      router.replace('/admin');
      router.refresh();
    } catch (activationError) {
      setError(
        activationError instanceof Error
          ? activationError.message
          : 'No fue posible activar la cuenta.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return <p className="py-16 text-center text-sm text-content-secondary">Verificando invitación...</p>;
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card variant="elevated" className="w-full max-w-md p-8">
        <p className="text-eyebrow uppercase text-gold-700">Panel de Administración</p>
        <h1 className="mt-3 font-serif text-2xl text-navy-800">Activa tu cuenta</h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          Define una contraseña para completar la invitación.
        </p>

        <form onSubmit={activateAccount} className="mt-7 space-y-5">
          <Input
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />

          {error && (
            <div role="alert" className="rounded border border-danger/30 bg-danger-soft p-3.5 text-sm text-danger">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Activar cuenta'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
