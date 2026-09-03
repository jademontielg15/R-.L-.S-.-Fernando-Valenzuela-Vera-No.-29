'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

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

export default function SolicitudesPage() {
  const supabase = createClient();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'revisadas'>('todas');

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-institucional-primario mb-2">
          Solicitudes de Ingreso
        </h1>
        <p className="text-gray-700">Gestiona las solicitudes de ingreso de candidatos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">TOTAL SOLICITUDES</p>
          <p className="text-4xl font-bold text-institucional-primario">{solicitudes.length}</p>
        </Card>
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">PENDIENTES</p>
          <p className="text-4xl font-bold text-orange-600">
            {solicitudes.filter((s) => !s.revisado).length}
          </p>
        </Card>
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">REVISADAS</p>
          <p className="text-4xl font-bold text-green-600">
            {solicitudes.filter((s) => s.revisado).length}
          </p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filtro === 'todas'
              ? 'bg-institucional-primario text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('pendientes')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filtro === 'pendientes'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro('revisadas')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filtro === 'revisadas'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Revisadas
        </button>
      </div>

      {/* Tabla */}
      <Card variant="bordered">
        {loading ? (
          <p className="text-gray-700 py-8 text-center">Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <div className="p-8 bg-institucional-fondo rounded text-center text-gray-700">
            <p className="font-semibold">No hay solicitudes en esta categoría</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-institucional-borde">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
                  <th className="px-4 py-3 text-left font-semibold">Profesión</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha Solicitud</th>
                  <th className="px-4 py-3 text-center font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-institucional-primario">{sol.nombre_completo}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{sol.email}</td>
                    <td className="px-4 py-3 text-gray-700">{sol.telefono}</td>
                    <td className="px-4 py-3 text-gray-700">{sol.profesion}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(sol.creado_en)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRevisado(sol.id, sol.revisado)}
                        className={`px-3 py-1 rounded font-semibold text-sm transition ${
                          sol.revisado
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {sol.revisado ? '✓ Revisada' : '◉ Pendiente'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => deleteSolicitud(sol.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-semibold text-sm transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
