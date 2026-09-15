import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { VisorPDF } from '@/components/revista/VisorPDF';
import { buttonStyles } from '@/components/ui/Button';
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

  const metadatos = [
    {
      etiqueta: 'Categoría',
      valor: (Array.isArray(documento.categorias)
        ? documento.categorias[0]?.nombre
        : undefined) || 'Sin categoría',
    },
    {
      etiqueta: 'Fecha de publicación',
      valor: new Date(documento.fecha_publicacion).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
    documento.numero_edicion
      ? { etiqueta: 'Edición', valor: `#${documento.numero_edicion}` }
      : null,
    documento.paginas ? { etiqueta: 'Páginas', valor: String(documento.paginas) } : null,
  ].filter(Boolean) as { etiqueta: string; valor: string }[];

  return (
    <div className="bg-surface-page">
      <section className="on-inverse border-b border-navy-700/60 bg-navy-900 text-content-inverse">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/revista"
            className="inline-flex items-center gap-2 text-sm text-navy-200 transition-colors duration-hover ease-out hover:text-content-inverse"
          >
            <span aria-hidden="true">&larr;</span>
            Volver a Revista
          </Link>
          <h1 className="mt-6 max-w-3xl font-serif text-content-inverse">{documento.titulo}</h1>
          <div className="mt-6 h-px w-16 bg-gold-400" />
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-14">
        {/* Los metadatos eran cuatro bloques sueltos en una tarjeta; como lista
            de definiciones con separadores hairline se leen como una ficha. */}
        <dl className="grid grid-cols-1 divide-y divide-line-subtle overflow-hidden rounded-md border border-line-subtle bg-surface-raised sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t">
          {metadatos.map((item) => (
            <div key={item.etiqueta} className="p-5">
              <dt className="text-eyebrow uppercase text-gold-700">{item.etiqueta}</dt>
              <dd className="mt-2 text-navy-800">{item.valor}</dd>
            </div>
          ))}
        </dl>

        {documento.descripcion && (
          <p className="measure mt-10 leading-relaxed text-content-secondary">
            {documento.descripcion}
          </p>
        )}

        <div className="mt-12">
          <VisorPDF documentoId={documento.id} titulo={documento.titulo} />
        </div>

        <div className="mt-12 border-t border-line-subtle pt-10">
          <Link href="/revista" className={buttonStyles({ variant: 'outline' })}>
            <span aria-hidden="true">&larr;</span>
            Volver a Hemeroteca
          </Link>
        </div>
      </section>
    </div>
  );
}
