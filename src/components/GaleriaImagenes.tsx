'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ImagenGaleria {
  url: string;
  alt: string;
  descripcion?: string;
  titulo?: string;
  categoria: 'eventos' | 'fraternidad' | 'convivencias';
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

const CATEGORY_FILTERS = [
  { value: 'todos', label: 'Todas' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'fraternidad', label: 'Fraternidad' },
  { value: 'convivencias', label: 'Convivencias' },
] as const;

export const GaleriaImagenes: React.FC<GaleriaImagenesProps> = ({
  imagenes,
  titulo,
  columnas = 3,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<ImagenGaleria['categoria'] | 'todos'>('todos');
  const visibleImages =
    activeCategory === 'todos'
      ? imagenes
      : imagenes.filter((imagen) => imagen.categoria === activeCategory);
  const selectedImage = selectedIndex === null ? null : visibleImages[selectedIndex];

  const closeViewer = () => setSelectedIndex(null);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null || visibleImages.length === 0
        ? current
        : (current - 1 + visibleImages.length) % visibleImages.length
    );
  }, [visibleImages.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null || visibleImages.length === 0 ? current : (current + 1) % visibleImages.length
    );
  }, [visibleImages.length]);

  const changeCategory = (category: ImagenGaleria['categoria'] | 'todos') => {
    setActiveCategory(category);
    setSelectedIndex(null);
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, showNext, showPrevious]);

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        {titulo && <h2 className="rule-accent font-serif">{titulo}</h2>}

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar memoria visual">
          {CATEGORY_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => changeCategory(value)}
              className={`rounded border px-4 py-2 text-sm transition-colors duration-hover ${
                activeCategory === value
                  ? 'border-navy-800 bg-navy-800 text-content-inverse'
                  : 'border-line text-content-secondary hover:border-navy-600 hover:text-navy-800'
              }`}
              aria-pressed={activeCategory === value}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={`mt-8 grid ${GRID[columnas]} gap-5`}>
          {visibleImages.map((img, idx) => (
            <figure
              key={img.url}
              className="group overflow-hidden rounded-md border border-line-subtle bg-surface-raised transition-[border-color,box-shadow] duration-hover ease-out hover:border-line hover:shadow-md"
            >
              <button
                type="button"
                className="relative block aspect-square w-full cursor-zoom-in overflow-hidden text-left"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Ampliar imagen: ${img.alt}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes={SIZES[columnas]}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </button>
              {img.titulo && (
                <figcaption className="border-t border-line-subtle p-4 text-sm font-medium text-navy-800">
                  {img.titulo}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de memoria visual"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <div className="relative flex max-h-full w-full max-w-6xl flex-col items-center gap-5">
            <div className="flex w-full items-center justify-between text-content-inverse">
              <div className="max-w-[70%]">
                <p className="text-base leading-relaxed text-content-inverse">
                  {selectedImage.descripcion || selectedImage.alt}
                </p>
              </div>
              <button
                type="button"
                onClick={closeViewer}
                className="inline-flex h-11 w-11 items-center justify-center rounded text-2xl text-content-inverse hover:bg-white/10"
                aria-label="Cerrar visor"
              >
                ×
              </button>
            </div>

            <div className="relative h-[min(70vh,720px)] w-full">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 768px) 92vw, 1100px"
                className="object-contain"
                quality={100}
              />
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="rounded border border-navy-400 px-4 py-2 text-sm text-content-inverse hover:bg-white/10"
                  aria-label="Imagen anterior"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="rounded border border-navy-400 px-4 py-2 text-sm text-content-inverse hover:bg-white/10"
                  aria-label="Imagen siguiente"
                >
                  Siguiente →
                </button>
                <span className="ml-2 text-sm text-navy-300">
                  {selectedIndex + 1} / {visibleImages.length}
                </span>
              </div>

              <Link
                href={`/registro?redirect=${encodeURIComponent('/nosotros')}`}
                className="rounded bg-gold-500 px-4 py-2 text-sm font-medium text-navy-950 hover:bg-gold-400"
              >
                Solicitar acceso para modificar
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
