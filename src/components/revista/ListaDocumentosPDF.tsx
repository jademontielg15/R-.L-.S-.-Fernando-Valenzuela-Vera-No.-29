import { createClient } from '@/lib/supabase/server';
import { TarjetaDocumento } from './TarjetaDocumento';

interface ListaDocumentosPDFProps {
  categoria?: string;
}

export async function ListaDocumentosPDF({ categoria }: ListaDocumentosPDFProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="rounded-md border border-dashed border-line bg-surface-sunken p-10 text-center">
        <p className="font-medium text-navy-800">La hemeroteca estará disponible próximamente</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-content-secondary">
          Estamos preparando las publicaciones institucionales. Mientras tanto, puedes contactarnos
          para solicitar información sobre una edición específica.
        </p>
      </div>
    );
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error('Error inicializando la hemeroteca:', error);
    return (
      <div role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-6">
        <p className="font-medium text-danger">La hemeroteca no está disponible</p>
        <p className="mt-2 text-sm text-danger/80">
          Intenta nuevamente más tarde o contacta con la administración.
        </p>
      </div>
    );
  }

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
        <p className="font-medium text-danger">La hemeroteca no está disponible</p>
        <p className="mt-2 text-sm text-danger/80">
          Intenta nuevamente más tarde o contacta con la administración.
        </p>
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
