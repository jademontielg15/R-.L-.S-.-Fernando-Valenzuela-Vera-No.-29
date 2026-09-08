import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded',
  'font-medium tracking-[-0.006em]',
  // Solo se anima lo que no dispara layout ni paint: transform, color y sombra.
  'transition-[transform,background-color,border-color,color,box-shadow]',
  'duration-hover ease-out',
  // Feedback de presión. Sin esto el botón no confirma que la interfaz escuchó.
  'active:scale-[0.97] active:duration-press',
  'disabled:pointer-events-none disabled:opacity-50',
  // El anillo de foco es global (:focus-visible en globals.css), en color de
  // marca. Antes cada botón pedía ring-2 sin color y caía al azul de Tailwind.
].join(' ');

const variantStyles: Record<ButtonVariant, string> = {
  // Hover real: se baja un escalón en la rampa. `bg-opacity-90` no oscurecía,
  // dejaba pasar el crema de la página por detrás y ensuciaba el color.
  default: 'bg-navy-800 text-content-inverse shadow-xs hover:bg-navy-700 hover:shadow-sm',
  secondary: 'bg-gold-700 text-content-inverse shadow-xs hover:bg-gold-800 hover:shadow-sm',
  outline:
    'border border-line-strong text-navy-800 bg-transparent hover:bg-navy-800 hover:text-content-inverse',
  ghost: 'text-navy-800 hover:bg-navy-800/[0.06]',
  link: 'text-navy-800 underline-offset-[0.2em] hover:text-gold-700 hover:underline active:scale-100',
  // Acciones destructivas del panel. Discreto en reposo, rojo sólido al pasar
  // por encima: la severidad aparece justo cuando el cursor apunta al botón.
  danger: 'border border-danger/30 bg-danger/[0.06] text-danger hover:bg-danger hover:text-white hover:border-danger',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-[3.25rem] px-8 text-[1.0625rem]',
};

/**
 * Las mismas clases, expuestas aparte, para que un `<Link>` pueda parecer un
 * botón sin anidar un `<button>` dentro de un `<a>` (HTML inválido: contenido
 * interactivo dentro de contenido interactivo).
 */
export function buttonStyles({
  variant = 'default',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variantStyles[variant], sizeStyles[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', type = 'button', ...props }, ref) => (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = 'Button';
