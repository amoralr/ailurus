import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { themeStore, toggleTheme } from '@/shared/stores/theme.store';

export function ThemeToggle() {
  const [isHydrated, setIsHydrated] = useState(false);
  const theme = useStore(themeStore);
  // During SSR, always show light theme icon to match server HTML
  const displayTheme = isHydrated ? theme : 'light';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
    >
      <span>
        {displayTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </span>
    </Button>
  );
}
