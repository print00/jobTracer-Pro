import type { Stage } from '../types';

export const STAGES: Stage[] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

export const STAGE_STYLES: Record<Stage, string> = {
  Wishlist: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  Applied: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  OA: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  Interview: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  Offer: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  Rejected: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
};
