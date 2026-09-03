import React from 'react';
import { Button } from '@/components/ui/Button';

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
}) => {
  const bgClass = backgroundDark ? 'bg-institucional-primario text-white' : 'bg-institucional-fondo';
  const textClass = backgroundDark ? 'text-gray-200' : 'text-institucional-texto';

  return (
    <section className={`${bgClass} py-20`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className={`font-serif text-5xl font-bold mb-6 ${backgroundDark ? '' : 'text-institucional-primario'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${textClass}`}>
            {subtitle}
          </p>
        )}
        {ctaText && (
          <a href={ctaHref}>
            <Button variant={backgroundDark ? 'secondary' : 'default'} size="lg">
              {ctaText}
            </Button>
          </a>
        )}
      </div>
    </section>
  );
};
