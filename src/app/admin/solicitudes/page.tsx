'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Stat } from '@/components/ui/Stat';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Solicitud {
  id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  profesion: string;
  estado_residencia: string;
  creado_en: string;
  revisado: boolean;
}

type Filtro = 'todas' | 'pendientes' | 'revisadas';

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'pendientes', label: 'Pendientes' },
  { valor: 'revisadas', label: 'Revisadas' },
];

const TH = 'px-4 py-3 text-left text-eyebrow uppercase text-content-muted';
const TD = 'px-4 py-4 align-middle text-content-secondary';

export default function SolicitudesPage() {
  const supabase = createClient();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>('todas');

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('solicitudes_ingreso')
          .select('*')
          .order('creado_en', { ascending: false });

        if (filtro === 'pendientes') {
          query = query.eq('revisado', false);
        } else if (filtro === 'revisadas') {
          query = query.eq('revisado', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        setSolicitudes(data || []);
      } catch (error) {
        console.error('Error fetching solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [filtro, supabase]);

  const toggleRevisado = async (id: string, currentRevisado: boolean) => {
    try {
      const { error } = await supabase
        .from('solicitudes_ingreso')
        .update({ revisado: !currentRevisado })
        .eq('id', id);

      if (error) throw error;

      setSolicitudes((prev) =>
        prev.map((sol) => (sol.id === id ? { ...sol, revisado: !sol.revisado } : sol))
      );
    } catch (error) {
      alert('Error al actualizar: ' + (error instanceof Error ? error.message : 'Error'));
    }
  };

  const deleteSolicitud = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) return;

    try {
      const { error } = await supabase.from('solicitudes_ingreso').delete().eq('id', id);

      if (error) throw error;

      setSolicitudes((prev) => prev.filter((sol) => sol.id !== id));
    } catch (error) {
      alert('Error al eliminar: ' + (error instanceof Error ? error.message : 'Error'));
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-navy-800">Solicitudes de Ingreso</h1>
        <p className="mt-2 text-content-secondary">
          Gestiona las solicitudes de ingreso de candidatos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Stat label="Total solicitudes" value={solicitudes.length} />
        <Stat
          label="Pendientes"
          value={solicitudes.filter((s) => !s.revisado).length}
          tone="accent"
        />
        <Stat
          label="Revisadas"
          value={solicitudes.filter((s) => s.revisado).length}
          tone="success"
        />
      </div>

      {/* Los tres filtros eran botones sólidos de tres colores distintos, con el
          mismo peso visual que las acciones reales. Ahora son un segmentado. */}
      <div
        role="tablist"
        aria-label="Filtrar solicitudes"
        className="inline-flex rounded-md border border-line-subtle bg-surface-raised p-1"
      >
        {FILTROS.map((item) => {
          const activo = filtro === item.valor;
          return (
            <button
              key={item.valor}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => setFiltro(item.valor)}
              className={cn(
                'rounded px-4 py-1.5 text-sm transition-[background-color,color] duration-hover ease-out',
                activo
                  ? 'bg-navy-800 text-content-inverse'
                  : 'text-content-secondary hover:text-navy-800'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-md border border-line-subtle bg-surface-raised">
        {loading ? (
          <p className="py-16 text-center text-sm text-content-secondary">
            Cargando solicitudes...
          </p>
        ) : solicitudes.length === 0 ? (
          <p className="px-6 py-16 text-center text-content-secondary">
            No hay solicitudes en esta categoría
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line-subtle bg-surface-sunken">
                <tr>
                  <th scope="col" className={TH}>Nombre</th>
                  <th scope="col" className={TH}>Email</th>
                  <th scope="col" className={TH}>Teléfono</th>
                  <th scope="col" className={TH}>Profesión</th>
                  <th scope="col" className={TH}>Fecha Solicitud</th>
                  <th scope="col" className={`${TH} text-center`}>Estado</th>
                  <th scope="col" className={`${TH} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {solicitudes.map((sol) => (
                  <tr
                    key={sol.id}
                    className="transition-colors duration-hover ease-out hover:bg-sand-50"
                  >
                    <td className={TD}>
                      <p className="font-medium text-navy-800">{sol.nombre_completo}</p>
                    </td>
                    <td className={TD}>
                      <a
                        href={`mailto:${sol.email}`}
                        className="underline-offset-4 transition-colors duration-hover ease-out hover:text-navy-800 hover:underline"
                      >
                        {sol.email}
                      </a>
                    </td>
                    <td className={TD}>{sol.telefono}</td>
                    <td className={TD}>{sol.profesion}</td>
                    <td className={TD}>{formatDate(sol.creado_en)}</td>
                    <td className={`${TD} text-center`}>
                      <Badge
                        tone={sol.revisado ? 'success' : 'pending'}
                        onClick={() => toggleRevisado(sol.id, sol.revisado)}
                      >
                        {sol.revisado ? 'Revisada' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className={`${TD} text-right`}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteSolicitud(sol.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
