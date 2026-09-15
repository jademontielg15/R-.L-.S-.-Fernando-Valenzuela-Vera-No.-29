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
        titulo="Memoria visual"
        imagenes={[
          {
            url: '/images/galeria/imagen-01.jpeg',
            alt: 'Ceremonia masónica en el interior de la logia',
            titulo: 'Vida de logia',
          },
          {
            url: '/images/galeria/imagen-02.jpeg',
            alt: 'Miembros participando en una ceremonia de la logia',
            titulo: 'Trabajo institucional',
          },
          {
            url: '/images/galeria/imagen-03.jpeg',
            alt: 'Actividad ceremonial dentro de la logia',
            titulo: 'Tradición y presencia',
          },
          {
            url: '/images/galeria/imagen-04.jpeg',
            alt: 'Miembro de la logia durante una participación ceremonial',
            titulo: 'Participación masónica',
          },
          {
            url: '/images/galeria/imagen-05.jpeg',
            alt: 'Grupo de miembros reunidos en la logia',
            titulo: 'Fraternidad',
          },
          {
            url: '/images/galeria/imagen-06.jpeg',
            alt: 'Grupo de masones reunidos para una fotografía institucional',
            titulo: 'Comunidad masónica',
          },
          {
            url: '/images/galeria/imagen-07.jpeg',
            alt: 'Actividad comunitaria con participación de la logia',
            titulo: 'Servicio a la comunidad',
          },
          {
            url: '/images/galeria/imagen-08.jpeg',
            alt: 'Miembros de la logia durante una actividad pública',
            titulo: 'Presencia institucional',
          },
          {
            url: '/images/galeria/imagen-09.jpeg',
            alt: 'Convivencia entre miembros de la logia',
            titulo: 'Convivencia',
          },
          {
            url: '/images/galeria/imagen-10.jpeg',
            alt: 'Grupo de miembros reunidos en una sesión de la logia',
            titulo: 'Historia compartida',
          },
        ]}
        columnas={4}
      />
    </>
  );
}
