import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
}) => (
  <section className="py-20 md:py-24">
    <div className="container mx-auto px-4">
      <div
        className={cn(
          'grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16',
          invertir && 'md:grid-flow-dense'
        )}
      >
        <div className={invertir ? 'md:col-start-2' : ''}>
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-line-subtle">
            <Image
              src={imagenUrl}
              alt={imagenAlt}
              fill
              // Sin `sizes`, next/image asume 100vw y descarga una imagen del
              // ancho del viewport para un hueco que nunca pasa de media columna.
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className={invertir ? 'md:col-start-1' : ''}>
          <h2 className="rule-accent font-serif">{titulo}</h2>
          <p className="measure mt-7 text-lg leading-relaxed text-content-secondary">
            {descripcion}
          </p>

          {puntos.length > 0 && (
            <ul className="mt-8 space-y-3">
              {puntos.map((punto, idx) => (
                <li key={idx} className="flex gap-3 text-content-secondary">
                  {/* Un guion largo dorado en vez de una viñeta en negrita:
                      el acento marca el ritmo sin gritar. */}
                  <span aria-hidden="true" className="select-none text-gold-700">
                    —
                  </span>
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
