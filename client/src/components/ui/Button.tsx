import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantMap: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90',
  secondary: 'bg-panelSoft text-text hover:bg-panelSoft/80 border border-border',
  ghost: 'text-text hover:bg-panelSoft/80',
  danger: 'bg-danger text-white hover:bg-danger/90'
};

export const Button = ({ className, variant = 'primary', ...props }: Props) => (
  <button
    className={cn(
      'focus-ring inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
      variantMap[variant],
      className
    )}
    {...props}
  />
);
