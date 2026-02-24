import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen lg:flex">
    <Sidebar />
    <main className="flex-1">{children}</main>
  </div>
);
