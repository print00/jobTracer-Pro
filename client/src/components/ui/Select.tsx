import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = ({ className, children, error, ...props }: Props) => (
  <div className="space-y-1">
    <select
      className={cn(
        'focus-ring h-11 w-full rounded-xl border border-border bg-panelSoft px-3 text-sm text-text transition-colors',
        error && 'border-danger',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error ? <p className="text-xs text-danger">{error}</p> : null}
  </div>
);
