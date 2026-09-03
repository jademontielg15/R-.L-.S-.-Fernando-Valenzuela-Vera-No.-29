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

export const GaleriaImagenes: React.FC<GaleriaImagenesProps> = ({
  imagenes,
  titulo,
  columnas = 3,
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columnas];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {titulo && (
          <h2 className="font-serif text-4xl font-bold text-center text-institucional-primario mb-12">
            {titulo}
          </h2>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {imagenes.map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
              <div className="relative w-full aspect-square">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
              </div>
              {img.titulo && (
                <div className="p-4 bg-white">
                  <p className="font-semibold text-institucional-primario">{img.titulo}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
