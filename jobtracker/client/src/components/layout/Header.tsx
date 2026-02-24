import { Download, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onExport: () => Promise<void>;
}

export const Header = ({ onExport }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/70 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-textMuted sm:text-sm">Welcome back</p>
          <h2 className="truncate text-base font-semibold tracking-tight sm:text-xl">{user?.name}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="focus-ring rounded-xl p-2 hover:bg-panelSoft" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="focus-ring rounded-xl p-2 hover:bg-panelSoft sm:hidden" onClick={() => void logout()} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => void logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-0 sm:flex sm:items-center sm:justify-end">
        <Button variant="secondary" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </header>
  );
};
