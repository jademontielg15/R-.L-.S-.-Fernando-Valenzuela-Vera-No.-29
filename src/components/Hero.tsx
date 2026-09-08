import React from 'react';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundDark?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaHref = '/',
  backgroundDark = true,
}) => (
  <section
    className={cn(
      'border-b',
      backgroundDark
        ? 'on-inverse border-navy-700/60 bg-navy-900 text-content-inverse'
        : 'border-line-subtle bg-surface-page'
    )}
  >
    <div className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-3xl">
        <h1
          className={cn(
            'text-display font-serif',
            backgroundDark ? 'text-content-inverse' : 'text-navy-800'
          )}
        >
          {title}
        </h1>

        {/* Regla dorada: el acento como puntuación editorial, no como relleno. */}
        <div
          className={cn(
            'mt-7 h-px w-16',
            backgroundDark ? 'bg-gold-400' : 'bg-gold-700'
          )}
        />

        {subtitle && (
          <p
            className={cn(
              'measure mt-7 text-lg leading-relaxed md:text-xl',
              backgroundDark ? 'text-navy-200' : 'text-content-secondary'
            )}
          >
            {subtitle}
          </p>
        )}

        {ctaText && (
          // Antes: <a><Button/></a>. Un <button> dentro de un <a> es HTML
          // inválido y rompe la navegación por teclado.
          <Link
            href={ctaHref}
            className={buttonStyles({
              variant: backgroundDark ? 'secondary' : 'default',
              size: 'lg',
              className: 'mt-10',
            })}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  </section>
);
