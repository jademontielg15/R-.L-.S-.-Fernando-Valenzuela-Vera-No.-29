'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { fieldStyles } from '@/components/ui/Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

/**
 * El select estaba escrito a mano en cada formulario con las clases viejas, así
 * que quedaba fuera del sistema: distinto alto, distinto borde y sin estado de
 * error. Comparte `fieldStyles` con Input y Textarea.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-navy-800">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              fieldStyles,
              // `appearance-none` + chevron propio: el control nativo de Windows
              // rompe la altura y el radio del resto de campos.
              'appearance-none pr-10',
              error &&
                'border-danger focus:border-danger focus:shadow-[inset_0_0_0_1px_rgb(var(--danger))]',
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
