import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ className, error, ...props }: Props) => (
  <div className="space-y-1">
    <input
      className={cn(
        'focus-ring h-11 w-full rounded-xl border border-border bg-panelSoft px-3 text-sm text-text placeholder:text-textMuted transition-colors',
        error && 'border-danger',
        className
      )}
      {...props}
    />
    {error ? <p className="text-xs text-danger">{error}</p> : null}
  </div>
);
