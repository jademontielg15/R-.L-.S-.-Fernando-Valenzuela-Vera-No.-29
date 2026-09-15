'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Stat } from '@/components/ui/Stat';
import { formatDate } from '@/lib/utils';

interface Documento {
  id: string;
  titulo: string;
  visible: boolean;
  fecha_publicacion: string;
  paginas: number | null;
  categorias?: { nombre: string };
}

const TH = 'px-4 py-3 text-left text-eyebrow uppercase text-content-muted';
const TD = 'px-4 py-4 align-middle text-content-secondary';

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

        setDocumentos(
          (data || []).map((documento) => ({
            ...documento,
            categorias: Array.isArray(documento.categorias)
              ? documento.categorias[0]
              : documento.categorias,
          }))
        );
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
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy-800">Dashboard</h1>
          <p className="mt-2 text-content-secondary">
            Gestiona los documentos de la revista institucional
          </p>
        </div>
        <Link href="/admin/documentos/nuevo" className={buttonStyles({ size: 'sm' })}>
          Subir documento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Stat label="Total documentos" value={documentos.length} />
        <Stat
          label="Visibles"
          value={documentos.filter((d) => d.visible).length}
          tone="success"
        />
        <Stat
          label="Borradores"
          value={documentos.filter((d) => !d.visible).length}
          tone="accent"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-5">
          <p className="font-medium text-danger">Error</p>
          <p className="mt-2 text-sm text-danger/80">{error}</p>
        </div>
      )}

      <section>
        <h2 className="font-serif text-xl text-navy-800">Documentos</h2>

        <div className="mt-5 overflow-hidden rounded-md border border-line-subtle bg-surface-raised">
          {loading ? (
            <p className="py-16 text-center text-sm text-content-secondary">
              Cargando documentos...
            </p>
          ) : documentos.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-content-secondary">No hay documentos todavía</p>
              <Link
                href="/admin/documentos/nuevo"
                className={buttonStyles({ className: 'mt-6' })}
              >
                Subir primer documento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-line-subtle bg-surface-sunken">
                  <tr>
                    <th scope="col" className={TH}>Título</th>
                    <th scope="col" className={TH}>Categoría</th>
                    <th scope="col" className={TH}>Fecha</th>
                    <th scope="col" className={`${TH} text-center`}>Páginas</th>
                    <th scope="col" className={`${TH} text-center`}>Visible</th>
                    <th scope="col" className={`${TH} text-right`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {documentos.map((doc) => (
                    <tr
                      key={doc.id}
                      className="transition-colors duration-hover ease-out hover:bg-sand-50"
                    >
                      <td className={TD}>
                        <p className="line-clamp-1 font-medium text-navy-800">{doc.titulo}</p>
                      </td>
                      <td className={TD}>{doc.categorias?.nombre || '—'}</td>
                      <td className={TD}>{formatDate(doc.fecha_publicacion)}</td>
                      <td className={`${TD} text-center tabular-nums`}>
                        {doc.paginas ? `${doc.paginas}` : '—'}
                      </td>
                      <td className={`${TD} text-center`}>
                        <Badge
                          tone={doc.visible ? 'success' : 'pending'}
                          onClick={() => toggleVisibility(doc.id, doc.visible)}
                        >
                          {doc.visible ? 'Visible' : 'Borrador'}
                        </Badge>
                      </td>
                      <td className={`${TD} text-right`}>
                        <div className="flex justify-end gap-2">
                          {/* Antes: <Link><Button/></Link>, un <button> dentro
                              de un <a>. Ahora el enlace lleva las clases. */}
                          <Link
                            href={`/admin/documentos/${doc.id}`}
                            className={buttonStyles({ variant: 'outline', size: 'sm' })}
                          >
                            Editar
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
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
