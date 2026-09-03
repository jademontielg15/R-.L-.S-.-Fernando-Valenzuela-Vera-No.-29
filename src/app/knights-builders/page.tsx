import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { GaleriaImagenes } from '@/components/GaleriaImagenes';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Knights Builders Grand Chapter | MRGLVM',
  description: 'Capítulo juvenil de la masonería. Una organización dedicada a jóvenes masones.',
  openGraph: {
    title: 'Knights Builders Grand Chapter | MRGLVM',
  },
};

export default function KnightsPage() {
  return (
    <>
      <Hero
        title="Knights Builders Grand Chapter"
        subtitle="La rama juvenil dedicada al desarrollo de nuevos líderes masónicos"
      />

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="font-serif text-4xl font-bold text-institucional-primario mb-6">
              Formando Líderes
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Knights Builders es nuestra organización dedicada a jóvenes masones con espíritu de construcción y progreso.
              Aquí desarrollamos liderazgo, fraternidad y compromiso comunitario.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Con programas educativos, actividades sociales y proyectos de impacto comunitario, nuestros Knights trabajan
              para construir un futuro mejor.
            </p>
            <div className="space-y-3">
              {[
                'Educación continua en principios masónicos',
                'Desarrollo de habilidades de liderazgo',
                'Proyectos de beneficencia comunitaria',
                'Mentoría de hermanos mayores',
                'Networking y fraternidad',
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-institucional-secundario font-bold text-xl">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://picsum.photos/seed/knights-builders/600/400"
              alt="Knights Builders"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-institucional-fondo">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center text-institucional-primario mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                titulo: 'Excelencia',
                descripcion: 'Comprometidos con la calidad en todo lo que hacemos.',
              },
              {
                titulo: 'Innovación',
                descripcion: 'Buscamos nuevas formas de impactar positivamente.',
              },
              {
                titulo: 'Integridad',
                descripcion: 'Actuamos con honestidad y rectitud siempre.',
              },
              {
                titulo: 'Comunidad',
                descripcion: 'Trabajamos juntos por el bien común.',
              },
            ].map((item, idx) => (
              <Card key={idx} variant="bordered">
                <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-3">
                  {item.titulo}
                </h3>
                <p className="text-gray-700 text-sm">{item.descripcion}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <GaleriaImagenes
        titulo="Nuestras Actividades"
        imagenes={[
          { url: 'https://picsum.photos/seed/knights-1/400/400', alt: 'Reunión de Knights' },
          { url: 'https://picsum.photos/seed/knights-2/400/400', alt: 'Proyecto comunitario' },
          { url: 'https://picsum.photos/seed/knights-3/400/400', alt: 'Ceremonia de iniciación' },
          { url: 'https://picsum.photos/seed/knights-4/400/400', alt: 'Evento de networking' },
        ]}
        columnas={4}
      />

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-institucional-primario mb-6">
            ¿Te gustaría unirte?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Si eres un joven masón o te interesa conocer más sobre nuestras actividades, no dudes en contactarnos.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-institucional-primario text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition"
          >
            Ponte en Contacto
          </a>
        </div>
      </section>
    </>
  );
}
