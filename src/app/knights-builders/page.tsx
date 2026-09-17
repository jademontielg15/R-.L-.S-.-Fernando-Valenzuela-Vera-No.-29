import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { GaleriaImagenes } from '@/components/GaleriaImagenes';
import { Card } from '@/components/ui/Card';
import { buttonStyles } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Knights Builders Grand Chapter | FVV29',
  description: 'Capítulo juvenil de la masonería. Una organización dedicada a jóvenes masones.',
  openGraph: {
    title: 'Knights Builders Grand Chapter | FVV29',
  },
};

const PUNTOS = [
  'Educación continua en principios masónicos',
  'Desarrollo de habilidades de liderazgo',
  'Proyectos de beneficencia comunitaria',
  'Mentoría de hermanos mayores',
  'Networking y fraternidad',
];

const VALORES = [
  { titulo: 'Excelencia', descripcion: 'Comprometidos con la calidad en todo lo que hacemos.' },
  { titulo: 'Innovación', descripcion: 'Buscamos nuevas formas de impactar positivamente.' },
  { titulo: 'Integridad', descripcion: 'Actuamos con honestidad y rectitud siempre.' },
  { titulo: 'Comunidad', descripcion: 'Trabajamos juntos por el bien común.' },
];

export default function KnightsPage() {
  return (
    <>
      <Hero
        title="Knights Builders Grand Chapter"
        subtitle="La rama juvenil dedicada al desarrollo de nuevos líderes masónicos"
      />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="rule-accent font-serif">Formando Líderes</h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-content-secondary">
              <p>
                Knights Builders es nuestra organización dedicada a jóvenes masones con espíritu de construcción y progreso.
                Aquí desarrollamos liderazgo, fraternidad y compromiso comunitario.
              </p>
              <p>
                Con programas educativos, actividades sociales y proyectos de impacto comunitario, nuestros Knights trabajan
                para construir un futuro mejor.
              </p>
            </div>
            <ul className="mt-8 space-y-3">
              {PUNTOS.map((item) => (
                <li key={item} className="flex gap-3 text-content-secondary">
                  <span aria-hidden="true" className="select-none text-gold-700">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-md border border-line-subtle">
            {/* Era un <img> crudo: sin optimización, sin lazy loading y sin
                dimensiones intrínsecas, así que empujaba el layout al cargar. */}
            <Image
              src="https://picsum.photos/seed/knights-builders/600/400"
              alt="Knights Builders"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line-subtle bg-surface-sunken py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="rule-accent font-serif">Nuestros Valores</h2>
          <div className="mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((item) => (
              <Card key={item.titulo}>
                <h3 className="font-serif text-xl text-navy-800">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-content-secondary">
                  {item.descripcion}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <GaleriaImagenes
        titulo="Nuestras Actividades"
        imagenes={[
          { url: 'https://picsum.photos/seed/knights-1/400/400', alt: 'Reunión de Knights', categoria: 'fraternidad' },
          { url: 'https://picsum.photos/seed/knights-2/400/400', alt: 'Proyecto comunitario', categoria: 'eventos' },
          { url: 'https://picsum.photos/seed/knights-3/400/400', alt: 'Ceremonia de iniciación', categoria: 'eventos' },
          { url: 'https://picsum.photos/seed/knights-4/400/400', alt: 'Evento de networking', categoria: 'convivencias' },
        ]}
        columnas={4}
      />

      <section className="container mx-auto px-4 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <h2 className="font-serif">¿Te gustaría unirte?</h2>
          <p className="measure mt-6 text-lg leading-relaxed text-content-secondary">
            Si eres un joven masón o te interesa conocer más sobre nuestras actividades, no dudes en contactarnos.
          </p>
          <Link href="/contacto" className={buttonStyles({ size: 'lg', className: 'mt-9' })}>
            Ponte en Contacto
          </Link>
        </div>
      </section>
    </>
  );
}
