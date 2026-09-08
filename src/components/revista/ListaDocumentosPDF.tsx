import { createClient } from '@/lib/supabase/server';
import { TarjetaDocumento } from './TarjetaDocumento';

interface ListaDocumentosPDFProps {
  categoria?: string;
}

export async function ListaDocumentosPDF({ categoria }: ListaDocumentosPDFProps) {
  const supabase = await createClient();

  // Obtener documentos visibles de la BD
  let query = supabase
    .from('documentos')
    .select(
      `
      id,
      titulo,
      descripcion,
      fecha_publicacion,
      numero_edicion,
      paginas,
      categorias(nombre)
    `
    )
    .eq('visible', true)
    .order('fecha_publicacion', { ascending: false });

  if (categoria) {
    query = query.eq('categorias.slug', categoria);
  }

  const { data: documentos, error } = await query;

  if (error) {
    console.error('Error fetching documentos:', error);
    return (
      <div role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-6">
        <p className="font-medium text-danger">Error al cargar documentos</p>
        <p className="mt-2 text-sm text-danger/80">{error.message}</p>
      </div>
    );
  }

  if (!documentos || documentos.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line p-10 text-center">
        <p className="text-content-secondary">
          No hay documentos disponibles en esta categoría
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {documentos.map((doc: any) => (
        <TarjetaDocumento
          key={doc.id}
          id={doc.id}
          titulo={doc.titulo}
          descripcion={doc.descripcion}
          fecha_publicacion={doc.fecha_publicacion}
          numero_edicion={doc.numero_edicion}
          paginas={doc.paginas}
          categoria={doc.categorias?.nombre}
        />
      ))}
    </div>
  );
}
