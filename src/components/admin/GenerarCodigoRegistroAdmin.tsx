'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function GenerarCodigoRegistroAdmin() {
  const [email, setEmail] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const generateCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCode(null);
    setExpiresAt(null);
    setCopyMessage(null);

    try {
      const response = await fetch('/api/admin/registration-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'No fue posible generar el código.');
      }

      setCode(result.code);
      setExpiresAt(result.expiresAt);
      setSetupSecret('');
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'No fue posible generar el código.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage('Código copiado.');
    } catch {
      setCopyMessage('No se pudo copiar; selecciona y copia el código manualmente.');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md p-8">
        <div className="border-b border-line-subtle pb-6">
          <p className="text-eyebrow uppercase text-gold-700">Acceso privado</p>
          <h1 className="mt-3 font-serif text-2xl text-navy-800">Generar código administrativo</h1>
          <p className="mt-2 text-sm leading-relaxed text-content-muted">
            Esta herramienta requiere la clave privada del sitio. El código generado queda ligado al correo indicado,
            vence en 48 horas y solo se muestra una vez.
          </p>
        </div>

        <form onSubmit={generateCode} className="mt-7 space-y-5">
          <Input
            label="Correo autorizado"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={loading}
          />
          <Input
            label="Clave privada del sitio"
            type="password"
            value={setupSecret}
            onChange={(event) => setSetupSecret(event.target.value)}
            autoComplete="off"
            required
            disabled={loading}
          />

          {error && (
            <div role="alert" className="rounded border border-danger/30 bg-danger-soft p-3.5 text-sm text-danger">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Generando...' : 'Generar código'}
          </Button>
        </form>

        {code && expiresAt && (
          <div className="mt-6 rounded border border-line-subtle bg-surface-sunken p-4">
            <p className="text-sm font-medium text-navy-800">Código de un solo uso</p>
            <code className="mt-2 block break-all rounded bg-surface-raised p-3 text-sm text-content-primary">
              {code}
            </code>
            <p className="mt-2 text-xs text-content-muted">
              Vence: {new Date(expiresAt).toLocaleString('es-MX')}
            </p>
            <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={copyCode}>
              Copiar código
            </Button>
            {copyMessage && <p role="status" className="mt-2 text-xs text-content-secondary">{copyMessage}</p>}
            <p className="mt-3 text-xs text-content-muted">
              Entrégalo únicamente a la persona autorizada y por un canal privado. No podrás volver a consultar este código.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
