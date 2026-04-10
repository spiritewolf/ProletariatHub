import { IconButton } from '@chakra-ui/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ReactElement, useEffect } from 'react';

const ColorMode = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export function ThemeToggleButton(): ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    if (!resolvedTheme) {
      setTheme(ColorMode.SYSTEM);
    }
  }, [resolvedTheme, setTheme]);

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      color="text.tertiary"
      size="sm"
      onClick={() => setTheme(isDark ? ColorMode.LIGHT : ColorMode.DARK)}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
