import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Badge = ({ label, className }: { label: string; className?: string }) => (
  <motion.span
    layout
    className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300', className)}
  >
    {label}
  </motion.span>
);
