import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { SeccionImagenTexto } from '@/components/SeccionImagenTexto';
import { GaleriaImagenes } from '@/components/GaleriaImagenes';
import { ANIO_FUNDACION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nosotros | MRGLVM',
  description: 'Conoce la Muy Respetable Gran Logia Valle de México, su historia y gobierno.',
  openGraph: {
    title: 'Nosotros | MRGLVM',
    description: 'Conoce la Muy Respetable Gran Logia Valle de México, su historia y gobierno.',
  },
};

export default function NosotrosPage() {
  const aniosHistoria = new Date().getFullYear() - ANIO_FUNDACION;

  return (
    <>
      <Hero
        title="Quiénes Somos"
        subtitle={`La Muy Respetable Gran Logia Valle de México, con ${aniosHistoria} años de tradición masónica.`}
      />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="measure space-y-6 text-lg leading-relaxed text-content-secondary">
          <p>
            Desde nuestra fundación en {ANIO_FUNDACION}, la Muy Respetable Gran Logia Valle de México ha sido un bastión
            de los valores masónicos: fraternidad, tolerancia, verdad y progreso.
          </p>
          <p>
            Con más de una docena de logias activas en el Valle de México, nuestros miembros trabajan incansablemente
            para mejorar la sociedad a través de la educación, la caridad y el mutuo apoyo.
          </p>
          <p>
            Nos enorgullece contar con miembros de diversas profesiones y orígenes, todos unidos por el compromiso
            de buscar la verdad y contribuir al bienestar de nuestras comunidades.
          </p>
        </div>
      </section>

      <SeccionImagenTexto
        titulo="Alto Cuerpo Directivo"
        descripcion="La administración de nuestra gran logia se realiza a través de un cuerpo directivo experimentado, elegido democráticamente por los miembros. Estos hermanos llevan a cabo la visión de nuestra institución."
        imagenUrl="https://picsum.photos/seed/alto-cuerpo/600/400"
        imagenAlt="Miembros del Alto Cuerpo Directivo"
        puntos={[
          'Gran Maestro: Liderazgo espiritual y administrativo',
          'Primer Vigilante: Supervisión de rituales',
          'Segundo Vigilante: Orden y disciplina',
          'Tesorero: Administración financiera',
          'Secretario: Registro y comunicación',
          'Otros oficiales especializados',
        ]}
      />

      <GaleriaImagenes
        titulo="Nuestras Instalaciones"
        imagenes={[
          { url: 'https://picsum.photos/seed/templo-1/400/400', alt: 'Templo masónico' },
          { url: 'https://picsum.photos/seed/templo-2/400/400', alt: 'Cámara de rituales' },
          { url: 'https://picsum.photos/seed/templo-3/400/400', alt: 'Salón de banquetes' },
          { url: 'https://picsum.photos/seed/templo-4/400/400', alt: 'Biblioteca' },
        ]}
        columnas={4}
      />
    </>
  );
}
