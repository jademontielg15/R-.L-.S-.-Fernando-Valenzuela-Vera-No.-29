'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

interface Documento {
  id: string;
  titulo: string;
  visible: boolean;
  fecha_publicacion: string;
  paginas: number | null;
  categorias?: { nombre: string };
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('documentos')
          .select(
            `
            id,
            titulo,
            visible,
            fecha_publicacion,
            paginas,
            categorias(nombre)
          `
          )
          .order('fecha_publicacion', { ascending: false });

        if (fetchError) throw fetchError;

        setDocumentos(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, [supabase]);

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('documentos')
        .update({ visible: !currentVisible })
        .eq('id', id);

      if (error) throw error;

      setDocumentos((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, visible: !doc.visible } : doc))
      );
    } catch (err) {
      alert('Error al actualizar visibilidad: ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;

    try {
      const { error } = await supabase.from('documentos').delete().eq('id', id);

      if (error) throw error;

      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-institucional-primario mb-2">Dashboard</h1>
        <p className="text-gray-700">Gestiona los documentos de la revista institucional</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">TOTAL DOCUMENTOS</p>
          <p className="text-4xl font-bold text-institucional-primario">{documentos.length}</p>
        </Card>
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">VISIBLES</p>
          <p className="text-4xl font-bold text-green-600">{documentos.filter((d) => d.visible).length}</p>
        </Card>
        <Card variant="elevated">
          <p className="text-gray-600 text-sm font-semibold">BORRADORES</p>
          <p className="text-4xl font-bold text-orange-600">{documentos.filter((d) => !d.visible).length}</p>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Tabla de documentos */}
      <Card variant="bordered">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-institucional-primario">Documentos</h2>

          {loading ? (
            <p className="text-gray-700 py-8 text-center">Cargando documentos...</p>
          ) : documentos.length === 0 ? (
            <div className="p-8 bg-institucional-fondo rounded text-center text-gray-700">
              <p className="font-semibold mb-4">No hay documentos todavía</p>
              <Link href="/admin/documentos/nuevo">
                <Button>Subir primer documento</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-institucional-borde">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Título</th>
                    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-center font-semibold">Páginas</th>
                    <th className="px-4 py-3 text-center font-semibold">Visible</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-institucional-primario line-clamp-1">
                          {doc.titulo}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{doc.categorias?.nombre || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(doc.fecha_publicacion)}</td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {doc.paginas ? `${doc.paginas}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleVisibility(doc.id, doc.visible)}
                          className={`px-3 py-1 rounded font-semibold text-sm transition ${
                            doc.visible
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          {doc.visible ? '✓ Visible' : '◉ Borrador'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Link href={`/admin/documentos/${doc.id}`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <button
                          onClick={() => deleteDocument(doc.id)}
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
        </div>
      </Card>
    </div>
  );
}
