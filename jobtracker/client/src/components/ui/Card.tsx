import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-2xl border border-border/80 bg-panel/75 p-5 shadow-card backdrop-blur transition-transform duration-200 hover:scale-[1.01]',
      className
    )}
    {...props}
  />
);
