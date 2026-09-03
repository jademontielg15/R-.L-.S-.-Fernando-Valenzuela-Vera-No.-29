import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-institucional-primario mb-2">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario transition-colors resize-none',
          error && 'border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

Textarea.displayName = 'Textarea';
