import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-institucional-primario mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario transition-colors',
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

Input.displayName = 'Input';
