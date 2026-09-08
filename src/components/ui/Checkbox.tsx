'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    // Antes: `Math.random()` en el cuerpo del render. El servidor y el cliente
    // generaban ids distintos y React reportaba hydration mismatch. `useId` da
    // un id estable en ambos lados.
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={inputId}
          className={cn(
            'mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 cursor-pointer rounded-sm',
            'border border-line accent-navy-800',
            'transition-[border-color,transform] duration-press ease-out',
            'hover:border-line-strong/50 active:scale-90',
            error && 'border-danger',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          ref={ref}
          {...props}
        />
        <div className="min-w-0">
          {label && (
            <label
              htmlFor={inputId}
              className="cursor-pointer text-sm leading-relaxed text-content-secondary"
            >
              {label}
            </label>
          )}
          {error && (
            <p id={errorId} className="mt-1 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
