import { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { ListaDocumentosPDF } from '@/components/revista/ListaDocumentosPDF';
import { buttonStyles } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Revista Institucional | MRGLVM',
  description: 'Hemeroteca de la Revista Institucional de la Muy Respetable Gran Logia Valle de México.',
  openGraph: {
    title: 'Revista Institucional | MRGLVM',
    description: 'Accede a nuestras publicaciones institucionales',
  },
};

export default function RevistaPage() {
  return (
    <>
      <Hero
        title="Revista Institucional"
        subtitle="Hemeroteca de publicaciones oficiales de la MRGLVM"
        backgroundDark={true}
      />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="measure">
          <h2 className="rule-accent font-serif">Acceso a Documentos</h2>
          <p className="mt-7 leading-relaxed text-content-secondary">
            A continuación encontrarás todas las ediciones de nuestra revista institucional y otros documentos de
            interés. Puedes navegar cada documento página por página directamente en tu navegador.
          </p>

          {/* Nota al margen: regla dorada a la izquierda en lugar de una caja
              blanca dentro de otra caja crema dentro de una tarjeta. */}
          <aside className="mt-7 border-l border-gold-700 bg-gold-50/60 py-4 pl-5 pr-4 text-sm leading-relaxed text-content-secondary">
            <strong className="font-medium text-navy-800">Nota:</strong> los documentos se visualizan en
            modo solo lectura. Si necesitas una copia descargable, por favor contacta a la administración.
          </aside>
        </div>

        <div className="mt-16">
          <h2 className="font-serif">Ediciones Disponibles</h2>
          <div className="mt-8">
            <ListaDocumentosPDF />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-md border border-line-subtle bg-surface-sunken p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="font-serif text-xl text-navy-800">¿No encontraste lo que buscas?</h3>
            <p className="mt-2 leading-relaxed text-content-secondary">
              Si necesitas información sobre alguna publicación específica o tienes sugerencias de documentos que deban
              ser incluidos, contacta con nosotros.
            </p>
          </div>
          <Link href="/contacto" className={buttonStyles({ className: 'shrink-0' })}>
            Contactarnos
          </Link>
        </div>
      </section>
    </>
  );
}
