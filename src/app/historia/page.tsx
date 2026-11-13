import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { LineaDeTiempo } from '@/components/LineaDeTiempo';
import { ANIO_FUNDACION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Historia de la Masonería | FVV29',
  description: 'Línea de tiempo y historia de la masonería en México y en la R:.L:.S:. Fernando Valenzuela Vera No. 29.',
  openGraph: {
    title: 'Historia de la Masonería | FVV29  ',
  },
};

export default function HistoriaPage() {
  const eventos = [
    {
      anio: ANIO_FUNDACION,
      titulo: 'Los primeros pasos',
      descripcion:
        'A principios de la década de 1980, siete hermanos comienzan a reunirse con el propósito de formar una nueva logia. El 12 de septiembre de 1980 se otorga la Carta Dispensa y se juramenta su primer cuadro.',
    },
    {
      anio: new Date().getFullYear(),
      titulo: 'Presente',
      descripcion:
        'Continuamos trabajando por los valores masónicos: verdad, fraternidad y progreso social.',
    },
  ];

  return (
    <>
      <Hero
        title="Nuestra historia"
        subtitle="Un viaje de tradición, educación y fraternidad"
      />

      <section className="container mx-auto px-4 pb-2 pt-20 md:pt-24">
        <p className="measure text-lg leading-relaxed text-content-secondary">
          La masonería es una fraternidad de hombres libres que busca la verdad, la tolerancia y el progreso moral.
          Esta es la historia de la R:.L:.S:. Fernando Valenzuela Vera No. 29, del Oriente de Cárdenas, Tabasco.
        </p>
      </section>

      <LineaDeTiempo items={eventos} />
    </>
  );
}
