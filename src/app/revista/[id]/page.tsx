import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { VisorPDF } from '@/components/revista/VisorPDF';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generar metadata dinámica
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from('documentos')
    .select('titulo, descripcion')
    .eq('id', id)
    .eq('visible', true)
    .single();

  if (!doc) {
    return {
      title: 'Documento no encontrado',
    };
  }

  return {
    title: `${doc.titulo} | MRGLVM`,
    description: doc.descripcion || 'Documento de la Revista Institucional',
    openGraph: {
      title: doc.titulo,
      description: doc.descripcion || 'Documento de la Revista Institucional',
    },
  };
}

export default async function DocumentoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Obtener datos del documento
  const { data: documento, error } = await supabase
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
    .eq('id', id)
    .eq('visible', true)
    .single();

  if (error || !documento) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-institucional-fondo">
      {/* Header */}
      <section className="bg-institucional-primario text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/revista" className="text-gray-200 hover:text-white transition mb-4 inline-block">
            ← Volver a Revista
          </Link>
          <h1 className="font-serif text-4xl font-bold">{documento.titulo}</h1>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 container mx-auto px-4 max-w-4xl">
        {/* Metadatos */}
        <Card variant="bordered" className="mb-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-semibold">CATEGORÍA</p>
              <p className="text-lg text-institucional-primario font-semibold">
                {documento.categorias?.nombre || 'Sin categoría'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">FECHA DE PUBLICACIÓN</p>
              <p className="text-lg text-institucional-primario font-semibold">
                {new Date(documento.fecha_publicacion).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {documento.numero_edicion && (
              <div>
                <p className="text-sm text-gray-600 font-semibold">EDICIÓN</p>
                <p className="text-lg text-institucional-primario font-semibold">#{documento.numero_edicion}</p>
              </div>
            )}
            {documento.paginas && (
              <div>
                <p className="text-sm text-gray-600 font-semibold">PÁGINAS</p>
                <p className="text-lg text-institucional-primario font-semibold">{documento.paginas}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Descripción */}
        {documento.descripcion && (
          <Card variant="bordered" className="mb-8 bg-white">
            <p className="text-gray-700 leading-relaxed">{documento.descripcion}</p>
          </Card>
        )}

        {/* Visor PDF */}
        <div className="mb-12">
          <VisorPDF documentoId={documento.id} titulo={documento.titulo} />
        </div>

        {/* Navegación */}
        <div className="flex justify-center gap-4">
          <Link
            href="/revista"
            className="inline-block bg-institucional-primario text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition"
          >
            ← Volver a Hemeroteca
          </Link>
        </div>
      </section>
    </div>
  );
}
