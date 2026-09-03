import React from 'react';
import Image from 'next/image';

interface SeccionImagenTextoProps {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  imagenAlt: string;
  invertir?: boolean;
  puntos?: string[];
}

export const SeccionImagenTexto: React.FC<SeccionImagenTextoProps> = ({
  titulo,
  descripcion,
  imagenUrl,
  imagenAlt,
  invertir = false,
  puntos = [],
}) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${invertir ? 'md:grid-flow-dense' : ''}`}>
          {/* Imagen */}
          <div className={invertir ? 'md:col-start-2' : ''}>
            <div className="relative w-full aspect-video">
              <Image
                src={imagenUrl}
                alt={imagenAlt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Texto */}
          <div className={invertir ? 'md:col-start-1' : ''}>
            <h2 className="font-serif text-4xl font-bold text-institucional-primario mb-6">
              {titulo}
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {descripcion}
            </p>
            {puntos.length > 0 && (
              <ul className="space-y-3">
                {puntos.map((punto, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-institucional-secundario font-bold">•</span>
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
