import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { LineaDeTiempo } from '@/components/LineaDeTiempo';
import { ANIO_FUNDACION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Historia de la Masonería | MRGLVM',
  description: 'Línea de tiempo y historia de la masonería en México y en el Valle de México.',
  openGraph: {
    title: 'Historia de la Masonería | MRGLVM',
  },
};

export default function HistoriaPage() {
  const eventos = [
    {
      anio: ANIO_FUNDACION,
      titulo: 'Fundación de la MRGLVM',
      descripcion: 'Se establece la Muy Respetable Gran Logia del Valle de México con los principios fundamentales de la masonería universal.',
    },
    {
      anio: 1947,
      titulo: 'Consolidación Institucional',
      descripcion: 'Expansión y fortalecimiento de nuestras logias. Se establece la estructura administrativa actual.',
    },
    {
      anio: 1955,
      titulo: 'Desarrollo y Reconocimiento',
      descripcion: 'Crecimiento significativo en número de miembros. Reconocimiento a nivel nacional e internacional.',
    },
    {
      anio: 1990,
      titulo: 'Modernización',
      descripcion: 'Adopción de nuevas metodologías en educación masónica. Inicio de programas de caridad más amplios.',
    },
    {
      anio: 2010,
      titulo: 'Era Digital',
      descripcion: 'Implementación de sistemas modernos de comunicación. Expansión de nuestro alcance comunitario.',
    },
    {
      anio: new Date().getFullYear(),
      titulo: 'Presente y Futuro',
      descripcion: 'Continuamos trabajando por los valores masónicos: verdad, fraternidad y progreso social.',
    },
  ];

  return (
    <>
      <Hero
        title="Historia de la Masonería"
        subtitle="Desde 1934: un viaje de tradición, educación y fraternidad"
      />

      <section className="container mx-auto px-4 pb-2 pt-20 md:pt-24">
        <p className="measure text-lg leading-relaxed text-content-secondary">
          La masonería es una fraternidad de hombres libres que busca la verdad, la tolerancia y el progreso moral.
          En el Valle de México, hemos sido testigos y actores de importantes transformaciones sociales.
        </p>
      </section>

      <LineaDeTiempo items={eventos} />
    </>
  );
}
