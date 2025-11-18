import { Moon, Sun } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { themeStore, toggleTheme } from '@/shared/stores/theme.store';

export function ThemeToggle() {
  const theme = useStore(themeStore);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
