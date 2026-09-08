import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'success' | 'pending' | 'neutral';

interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: BadgeTone;
  /** Si es `false` se renderiza como etiqueta estática en vez de botón. */
  interactive?: boolean;
}

/**
 * Píldora de estado. El naranja de Tailwind que marcaba "borrador"/"pendiente"
 * no existía en la paleta y chocaba con el dorado institucional; el estado
 * pendiente usa ahora ese mismo dorado.
 */
const toneStyles: Record<BadgeTone, string> = {
  success: 'border-success/25 bg-success/10 text-success',
  pending: 'border-gold-300 bg-gold-100 text-gold-800',
  neutral: 'border-line bg-surface-sunken text-content-secondary',
};

const base =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium';

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  interactive = true,
  className,
  children,
  ...props
}) => {
  if (!interactive) {
    return <span className={cn(base, toneStyles[tone], className)}>{children}</span>;
  }

  return (
    <button
      type="button"
      className={cn(
        base,
        toneStyles[tone],
        'transition-[filter,transform] duration-press ease-out hover:brightness-[0.97] active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
