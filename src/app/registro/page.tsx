'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setError('El registro estará disponible cuando se configure la plataforma de la comunidad.');
        return;
      }

      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        router.push('/nosotros');
        router.refresh();
        return;
      }

      setMessage(
        'Cuenta creada. Revisa tu correo para confirmar el registro. El acceso para aportar imágenes requiere aprobación como miembro.'
      );
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : 'No fue posible crear la cuenta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card variant="elevated" className="w-full max-w-md p-8">
        <p className="text-eyebrow uppercase text-gold-700">Comunidad MRGLVM</p>
        <h1 className="mt-3 font-serif text-3xl text-navy-800">Crear una cuenta</h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          Regístrate para acceder a las funciones de la comunidad. Las cuentas nuevas comienzan con
          permisos de lectura; la participación en galerías requiere aprobación.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={loading}
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          {message && (
            <div role="status" className="rounded border border-success/30 bg-success/10 p-3.5 text-sm text-success">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
