import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      className={cn(
        'bg-white rounded',
        variant === 'default' && 'p-6',
        variant === 'bordered' && 'p-6 border-2 border-institucional-borde',
        variant === 'elevated' && 'p-6 shadow-lg',
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
    <div className={cn('mb-4 border-b border-institucional-borde pb-4', className)} ref={ref} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('', className)} ref={ref} {...props} />
  )
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('mt-4 border-t border-institucional-borde pt-4 flex gap-2', className)} ref={ref} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';
