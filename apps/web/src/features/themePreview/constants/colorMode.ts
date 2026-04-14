export const ColorModeToggleColorPalette = {
  BRAND: 'brand',
} as const;

export const ColorModeToggleButtonSize = {
  SM: 'sm',
} as const;

export const ColorMode = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

export const ColorModeToggleButtonVariant = {
  SELECTED: 'solid',
  UNSELECTED: 'outline',
} as const;

export type ColorModeToggleButtonVariant =
  (typeof ColorModeToggleButtonVariant)[keyof typeof ColorModeToggleButtonVariant];

export function colorModeToggleButtonVariant(
  currentPreference: string | undefined,
  mode: ColorMode,
): ColorModeToggleButtonVariant {
  return currentPreference === mode
    ? ColorModeToggleButtonVariant.SELECTED
    : ColorModeToggleButtonVariant.UNSELECTED;
}

export const THEME_TOGGLE_ENTRIES = [
  { mode: ColorMode.LIGHT, label: 'Light' },
  { mode: ColorMode.DARK, label: 'Dark' },
  { mode: ColorMode.SYSTEM, label: 'System' },
] as const satisfies ReadonlyArray<{ readonly label: string; readonly mode: ColorMode }>;

/** Shown while `next-themes` has not resolved preference yet */
export const THEME_DISPLAY_PENDING = '…' as const;
