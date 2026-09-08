import React from 'react';
import Image from 'next/image';

interface ImagenGaleria {
  url: string;
  alt: string;
  titulo?: string;
}

interface GaleriaImagenesProps {
  imagenes: ImagenGaleria[];
  titulo?: string;
  columnas?: 2 | 3 | 4;
}

const GRID = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
} as const;

const SIZES = {
  2: '(min-width: 640px) 50vw, 100vw',
  3: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  4: '(min-width: 1024px) 25vw, 50vw',
} as const;

export const GaleriaImagenes: React.FC<GaleriaImagenesProps> = ({
  imagenes,
  titulo,
  columnas = 3,
}) => (
  <section className="py-20 md:py-24">
    <div className="container mx-auto px-4">
      {titulo && <h2 className="rule-accent font-serif">{titulo}</h2>}

      <div className={`mt-12 grid ${GRID[columnas]} gap-5`}>
        {imagenes.map((img, idx) => (
          <figure
            key={idx}
            // `group` para que el zoom responda al hover de la tarjeta entera y
            // no solo al de la imagen, que era lo que pasaba antes.
            className="group overflow-hidden rounded-md border border-line-subtle bg-surface-raised transition-[border-color,box-shadow] duration-hover ease-out hover:border-line hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes={SIZES[columnas]}
                // `transition` a secas es `transition-property: all`: anima
                // cualquier propiedad que cambie, incluidas las que fuerzan
                // layout. Aquí solo se anima el transform, que va en GPU.
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            {img.titulo && (
              <figcaption className="border-t border-line-subtle p-4 text-sm font-medium text-navy-800">
                {img.titulo}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  </section>
);
