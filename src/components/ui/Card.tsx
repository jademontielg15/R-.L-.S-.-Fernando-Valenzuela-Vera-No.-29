import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  /** Solo para tarjetas que son enlaces o botones: añade hover y presión. */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => (
    <div
      className={cn(
        'rounded-md bg-surface-raised p-6',
        // Un borde de 1px sostiene la tarjeta contra el crema; el de 2px
        // anterior competía con el contenido y la hacía parecer un formulario.
        variant === 'default' && 'border border-line-subtle',
        variant === 'bordered' && 'border border-line',
        variant === 'elevated' && 'border border-line-subtle/60 shadow-md',
        interactive && [
          'transition-[transform,box-shadow,border-color] duration-hover ease-out',
          'hover:-translate-y-0.5 hover:border-line hover:shadow-lg',
          'active:translate-y-0 active:scale-[0.995] active:duration-press',
        ],
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('mb-5 border-b border-line-subtle pb-4', className)}
      ref={ref}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('text-content-secondary', className)} ref={ref} {...props} />
  )
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('mt-5 flex gap-3 border-t border-line-subtle pt-4', className)}
      ref={ref}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
