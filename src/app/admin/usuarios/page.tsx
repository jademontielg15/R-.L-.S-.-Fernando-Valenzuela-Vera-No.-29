'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { AdminRole } from '@/lib/admin/types';

interface AdminUser {
  id: string;
  email: string;
  confirmed: boolean;
  role: AdminRole;
}

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users');
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'No fue posible cargar las cuentas.');
      setUsers(result.users);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar las cuentas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const createAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'No fue posible crear la cuenta.');

      setMessage(result.message);
      setEmail('');
      await loadUsers();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'No fue posible crear la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  const revokeAdmin = async (user: AdminUser) => {
    if (!confirm(`¿Revocar el acceso administrativo de ${user.email}?`)) return;

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'No fue posible revocar la cuenta.');

      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage('Se revocó el acceso administrativo.');
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : 'No fue posible revocar la cuenta.');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-navy-800">Administrar cuentas</h1>
        <p className="mt-2 text-content-secondary">
          Invita administradores y asigna sus permisos. Las cuentas nuevas recibirán un enlace de activación.
        </p>
      </div>

      <section className="max-w-2xl rounded-md border border-line-subtle bg-surface-raised p-6">
        <h2 className="font-serif text-xl text-navy-800">Crear una cuenta administrativa</h2>
        <form onSubmit={createAdmin} className="mt-6 space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={saving}
          />
          <Select
            label="Permisos"
            value={role}
            onChange={(event) => setRole(event.target.value as AdminRole)}
            disabled={saving}
          >
            <option value="admin">Administrador</option>
            <option value="super_admin">Superadministrador</option>
          </Select>
          <Button type="submit" disabled={saving}>
            {saving ? 'Procesando...' : 'Crear o actualizar cuenta'}
          </Button>
        </form>
      </section>

      {error && (
        <div role="alert" className="rounded border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="rounded border border-success/30 bg-success/10 p-4 text-sm text-success">
          {message}
        </div>
      )}

      <section>
        <h2 className="font-serif text-xl text-navy-800">Cuentas autorizadas</h2>
        <div className="mt-5 overflow-hidden rounded-md border border-line-subtle bg-surface-raised">
          {loading ? (
            <p className="py-12 text-center text-sm text-content-secondary">Cargando cuentas...</p>
          ) : users.length === 0 ? (
            <p className="py-12 text-center text-sm text-content-secondary">No hay cuentas administrativas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-line-subtle bg-surface-sunken">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-eyebrow uppercase text-content-muted">Correo</th>
                    <th scope="col" className="px-4 py-3 text-left text-eyebrow uppercase text-content-muted">Permisos</th>
                    <th scope="col" className="px-4 py-3 text-left text-eyebrow uppercase text-content-muted">Estado</th>
                    <th scope="col" className="px-4 py-3 text-right text-eyebrow uppercase text-content-muted">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-content-secondary">{user.email}</td>
                      <td className="px-4 py-4 text-content-secondary">
                        {user.role === 'super_admin' ? 'Superadministrador' : 'Administrador'}
                      </td>
                      <td className="px-4 py-4 text-content-secondary">
                        {user.confirmed ? 'Activa' : 'Invitación pendiente'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => revokeAdmin(user)}
                          disabled={user.role === 'super_admin' && users.filter((item) => item.role === 'super_admin').length === 1}
                        >
                          Revocar acceso
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
