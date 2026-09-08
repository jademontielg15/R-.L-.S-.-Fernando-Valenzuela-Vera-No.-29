'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { fieldStyles } from '@/components/ui/Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-navy-800"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            fieldStyles,
            'resize-y leading-relaxed',
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

Textarea.displayName = 'Textarea';
