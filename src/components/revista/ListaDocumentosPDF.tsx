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
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 font-semibold">Error al cargar documentos</p>
        <p className="text-red-600 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!documentos || documentos.length === 0) {
    return (
      <div className="p-6 bg-institucional-fondo border border-institucional-borde rounded text-center">
        <p className="text-gray-700 font-semibold">No hay documentos disponibles en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
