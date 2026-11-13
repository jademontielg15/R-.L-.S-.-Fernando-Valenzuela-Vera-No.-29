'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function RegistroCuentaAdministrativa() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setCompleted(false);

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'No fue posible completar el registro.');
      }

      setMessage(result.message);
      setCompleted(true);
      setCode('');
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : 'No fue posible completar el registro.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md p-8">
        <div className="border-b border-line-subtle pb-6">
          <p className="text-eyebrow uppercase text-gold-700">Panel de Administración</p>
          <h1 className="mt-3 font-serif text-2xl text-navy-800">Registro administrativo</h1>
          <p className="mt-2 text-sm leading-relaxed text-content-muted">
            Necesitas un código privado asignado a tu correo. Los códigos vencen y solo pueden usarse una vez.
          </p>
        </div>

        <form onSubmit={register} className="mt-7 space-y-5">
          <Input
            label="Correo autorizado"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={loading || completed}
          />
          <Input
            label="Código privado"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="one-time-code"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={loading || completed}
          />

          {error && (
            <div role="alert" className="rounded border border-danger/30 bg-danger-soft p-3.5 text-sm text-danger">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="rounded border border-success/30 bg-success/10 p-3.5 text-sm text-success">
              {message}
            </div>
          )}

          {!completed && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Validando código...' : 'Continuar'}
            </Button>
          )}
        </form>

        {completed && (
          <Link
            href="/admin/login"
            className="mt-5 inline-block text-sm font-medium text-navy-800 underline underline-offset-4"
          >
            Ir al inicio de sesión
          </Link>
        )}

        <p className="mt-7 border-t border-line-subtle pt-5 text-sm text-content-muted">
          ¿Ya tienes cuenta?{' '}
          <Link href="/admin/login" className="font-medium text-navy-800 underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
