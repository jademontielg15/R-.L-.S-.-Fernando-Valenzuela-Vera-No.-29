import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ListaDocumentosPDF } from '@/components/revista/ListaDocumentosPDF';
import { Card } from '@/components/ui/Card';

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

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <Card variant="bordered" className="bg-institucional-fondo">
            <h2 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              Acceso a Documentos
            </h2>
            <p className="text-gray-700 mb-4">
              A continuación encontrarás todas las ediciones de nuestra revista institucional y otros documentos de
              interés. Puedes navegar cada documento página por página directamente en tu navegador.
            </p>
            <div className="bg-white p-4 rounded border-l-4 border-institucional-secundario text-sm text-gray-700">
              <p>
                <strong>📄 Nota:</strong> Los documentos se visualizan en modo solo lectura. Si necesitas una copia
                descargable, por favor contacta a la administración.
              </p>
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <h3 className="font-serif text-3xl font-bold text-institucional-primario mb-8">
            Ediciones Disponibles
          </h3>
          <ListaDocumentosPDF />
        </div>

        <div className="bg-institucional-fondo p-8 rounded-lg text-center border border-institucional-borde">
          <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-3">
            ¿No encontraste lo que buscas?
          </h3>
          <p className="text-gray-700 mb-6">
            Si necesitas información sobre alguna publicación específica o tienes sugerencias de documentos que deban
            ser incluidos, contacta con nosotros.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-institucional-primario text-white px-6 py-2 rounded font-semibold hover:bg-opacity-90 transition"
          >
            Contactarnos
          </a>
        </div>
      </section>
    </>
  );
}
