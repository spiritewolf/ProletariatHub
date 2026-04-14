export const ChakraButtonVariant = {
  SOLID: 'solid',
  OUTLINE: 'outline',
  GHOST: 'ghost',
} as const;

export const ChakraCardVariant = {
  OUTLINE: 'outline',
} as const;

export const ChakraBadgeVariant = {
  SUBTLE: 'subtle',
  SOLID: 'solid',
} as const;

export const ChakraColorPalette = {
  BRAND: 'brand',
  PRIORITY_URGENT: 'priorityUrgent',
  PRIORITY_HIGH: 'priorityHigh',
  PRIORITY_MEDIUM: 'priorityMedium',
  PRIORITY_LOW: 'priorityLow',
} as const;

export const ThemePreviewButtonSize = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export const THEME_PREVIEW_BUTTON_SIZES = [
  ThemePreviewButtonSize.SM,
  ThemePreviewButtonSize.MD,
  ThemePreviewButtonSize.LG,
];

export const PRIORITY_BADGE_ROWS = [
  { key: 'urgent', label: 'Urgent', palette: ChakraColorPalette.PRIORITY_URGENT },
  { key: 'high', label: 'High', palette: ChakraColorPalette.PRIORITY_HIGH },
  { key: 'medium', label: 'Medium', palette: ChakraColorPalette.PRIORITY_MEDIUM },
  { key: 'low', label: 'Low', palette: ChakraColorPalette.PRIORITY_LOW },
];
