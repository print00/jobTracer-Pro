import type { ReactNode } from 'react';

export const AuthPageShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="grid min-h-screen place-items-center px-4">
    <div className="w-full max-w-md rounded-2xl border border-border bg-panel/85 p-8 shadow-glass backdrop-blur">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-textMuted">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);
