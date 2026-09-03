import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={inputId}
          className={cn(
            'w-5 h-5 rounded border-2 border-institucional-borde cursor-pointer accent-institucional-primario mt-1',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        <div>
          {label && (
            <label htmlFor={inputId} className="text-sm text-institucional-texto cursor-pointer">
              {label}
            </label>
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
