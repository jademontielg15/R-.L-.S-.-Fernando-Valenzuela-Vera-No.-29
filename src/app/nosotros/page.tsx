import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { GaleriaImagenes } from '@/components/GaleriaImagenes';
import { ANIO_FUNDACION, STORAGE_BUCKET_GALERIA } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Nosotros | FVV29',
  description: 'Conoce la R:.L:.S:. Fernando Valenzuela Vera No. 29, su historia y gobierno.',
  openGraph: {
    title: 'Nosotros | FVV29',
    description: 'Conoce la R:.L:.S:. Fernando Valenzuela Vera No. 29, su historia y gobierno.',
  },
};

export default async function NosotrosPage() {
  const aniosHistoria = new Date().getFullYear() - ANIO_FUNDACION;
  const supabase = await createClient();
  const { data: imagenesSubidas, error: errorGaleria } = await supabase
    .from('galeria_imagenes')
    .select('archivo_path, titulo, alt, descripcion, categoria')
    .eq('visible', true)
    .order('creado_en', { ascending: false });

  if (errorGaleria) {
    console.error('Error al cargar imágenes de la galería:', errorGaleria.message);
  }

  const imagenesPublicadas = (imagenesSubidas || []).map((imagen) => ({
    url: supabase.storage
      .from(STORAGE_BUCKET_GALERIA)
      .getPublicUrl(imagen.archivo_path).data.publicUrl,
    titulo: imagen.titulo,
    alt: imagen.alt,
    descripcion: imagen.descripcion || undefined,
    categoria: imagen.categoria,
  }));

  return (
    <>
      <Hero
        title="Quiénes Somos"
        subtitle={`La R:.L:.S:. Fernando Valenzuela Vera No. 29, con ${aniosHistoria} años de tradición masónica.`}
      />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="measure space-y-6 text-lg leading-relaxed text-content-secondary">
          <p>
            Desde nuestra fundación en {ANIO_FUNDACION}, la R:.L:.S:. Fernando Valenzuela Vera No. 29 ha sido un bastión
            de los valores masónicos: fraternidad, tolerancia, verdad y progreso.
          </p>
          <p>
            Los hermanos de la R:.L:.S:. Fernando Valenzuela Vera No. 29 trabajan por los valores
            masónicos de verdad, fraternidad y progreso social.
          </p>
          <p>
            Nos enorgullece contar con miembros de diversas profesiones y orígenes, todos unidos por el compromiso
            de buscar la verdad y contribuir al bienestar de nuestras comunidades.
          </p>
        </div>
      </section>

      <GaleriaImagenes
        titulo="Memoria visual"
        error={errorGaleria ? 'No fue posible cargar las imágenes nuevas de la galería.' : null}
        imagenes={[
          {
            url: '/images/galeria/imagen-01.jpeg',
            alt: 'Ceremonia masónica en el interior de la logia',
            descripcion: 'Ceremonia institucional de la logia.',
            categoria: 'fraternidad',
          },
          {
            url: '/images/galeria/imagen-04.jpeg',
            alt: 'Miembro de la logia durante una participación ceremonial',
            descripcion: 'Participación de un miembro durante la ceremonia.',
            categoria: 'fraternidad',
          },
          {
            url: '/images/galeria/imagen-05.jpeg',
            alt: 'Grupo de miembros reunidos en la logia',
            descripcion: 'Encuentro de miembros de la comunidad.',
            categoria: 'fraternidad',
          },
          {
            url: '/images/galeria/imagen-06.jpeg',
            alt: 'Grupo de masones reunidos para una fotografía institucional',
            descripcion: 'Fotografía institucional de la fraternidad.',
            categoria: 'fraternidad',
          },
          {
            url: '/images/galeria/imagen-07.jpeg',
            alt: 'Actividad comunitaria con participación de la logia',
            descripcion: 'Actividad comunitaria con participación de la logia.',
            categoria: 'eventos',
          },
          {
            url: '/images/galeria/imagen-08.jpeg',
            alt: 'Miembros de la logia durante una actividad pública',
            descripcion: 'Miembros durante una actividad pública.',
            categoria: 'eventos',
          },
          {
            url: '/images/galeria/imagen-09.jpeg',
            alt: 'Convivencia entre miembros de la logia',
            descripcion: 'Convivencia entre miembros de la logia.',
            categoria: 'convivencias',
          },
          {
            url: '/images/galeria/imagen-10.jpeg',
            alt: 'Grupo de miembros reunidos en una sesión de la logia',
            descripcion: 'Reunión de miembros de la comunidad.',
            categoria: 'fraternidad',
          },
          ...imagenesPublicadas,
        ]}
        columnas={4}
      />
    </>
  );
}
