'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/** Clases compartidas por Input y Textarea para que ambos campos sean gemelos. */
export const fieldStyles = [
  'w-full rounded bg-surface-raised px-3.5 py-2.5 text-base text-content-primary',
  'border border-line placeholder:text-content-muted',
  'transition-[border-color,box-shadow] duration-hover ease-out',
  'hover:border-line-strong/40',
  // El foco engrosa el borde con una sombra interior en vez de con border-width:
  // cambiar el grosor del borde desplazaría el texto 1px al enfocar.
  'focus:border-navy-800 focus:shadow-[inset_0_0_0_1px_rgb(var(--navy-800))] focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
].join(' ');

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-navy-800"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            fieldStyles,
            error &&
              'border-danger focus:border-danger focus:shadow-[inset_0_0_0_1px_rgb(var(--danger))]',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-content-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
