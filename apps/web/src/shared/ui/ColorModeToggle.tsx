import { Button, HStack, Text } from '@chakra-ui/react';
import {
  type ColorMode,
  ColorModeToggleButtonSize,
  colorModeToggleButtonVariant,
  ColorModeToggleColorPalette,
  THEME_DISPLAY_PENDING,
  THEME_TOGGLE_ENTRIES,
} from '@proletariat-hub/web/shared/constants/color-mode';
import { useTheme } from 'next-themes';
import type { ReactElement } from 'react';

export function ColorModeToggle(): ReactElement {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const onPick = (mode: ColorMode): void => {
    setTheme(mode);
  };

  return (
    <HStack
      gap="2"
      position="fixed"
      bottom={{ base: '4', md: '6' }}
      insetInlineEnd={{ base: '4', md: '6' }}
      zIndex="sticky"
      wrap="wrap"
      justify="flex-end"
    >
      <Text fontSize="sm" color="text.secondary" display={{ base: 'none', sm: 'block' }}>
        Mode ({resolvedTheme ?? theme ?? THEME_DISPLAY_PENDING})
      </Text>
      {THEME_TOGGLE_ENTRIES.map((entry) => (
        <Button
          key={entry.mode}
          colorPalette={ColorModeToggleColorPalette.BRAND}
          onClick={() => {
            onPick(entry.mode);
          }}
          size={ColorModeToggleButtonSize.SM}
          variant={colorModeToggleButtonVariant(theme, entry.mode)}
        >
          {entry.label}
        </Button>
      ))}
    </HStack>
  );
}
