import { LayoutDashboard, BriefcaseBusiness } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-panel/70 p-6 backdrop-blur lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-textMuted">Dashboard</p>
          <h1 className="text-lg font-semibold tracking-tight">JobTrackr Pro</h1>
        </div>
      </div>

      <nav className="space-y-2">
        <a
          href="#overview"
          className={cn(
            'focus-ring flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-panelSoft',
            'bg-panelSoft text-text'
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </a>
      </nav>
    </aside>
  );
};
