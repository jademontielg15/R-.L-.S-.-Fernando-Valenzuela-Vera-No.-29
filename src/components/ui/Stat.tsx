import React from 'react';
import { cn } from '@/lib/utils';

interface StatProps {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'accent' | 'success';
}

const toneStyles = {
  default: 'text-navy-800',
  accent: 'text-gold-700',
  success: 'text-success',
} as const;

/**
 * Tarjeta de métrica del panel. Antes cada página repetía el mismo bloque con
 * `text-4xl font-bold` y un verde/naranja de Tailwind fuera de la paleta.
 */
export const Stat: React.FC<StatProps> = ({ label, value, tone = 'default' }) => (
  <div className="rounded-md border border-line-subtle bg-surface-raised p-6">
    <p className="text-eyebrow uppercase text-content-muted">{label}</p>
    {/* `tabular-nums` evita que los dígitos bailen de ancho al actualizarse. */}
    <p className={cn('mt-3 font-serif text-4xl tabular-nums', toneStyles[tone])}>{value}</p>
  </div>
);
