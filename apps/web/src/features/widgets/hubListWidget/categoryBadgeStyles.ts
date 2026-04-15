type CategoryBadgeVisual = string | { base: string; _dark: string };

export type CategoryBadgeStyle = {
  bg: CategoryBadgeVisual;
  color: CategoryBadgeVisual;
};

const DEFAULT_BADGE: CategoryBadgeStyle = {
  bg: 'bg.input',
  color: 'text.secondary',
};

const CATEGORY_BADGE_BY_NAME: Record<string, CategoryBadgeStyle> = {
  Dairy: { bg: 'info.subtle', color: 'info.fg' },
  Cleaning: { bg: 'warning.subtle', color: 'warning.fg' },
  Produce: { bg: 'success.subtle', color: 'success.fg' },
  Household: {
    bg: { base: 'neutral.subtle', _dark: 'bg.input' },
    color: { base: 'neutral.fg', _dark: 'text.primary' },
  },
  Beverages: { bg: 'bg.secondary', color: 'accent.primary' },
  Pantry: { bg: 'hubList.priorityMedium.bg', color: 'hubList.priorityMedium.fg' },
};

export function getCategoryBadgeStyle(category: string | null): CategoryBadgeStyle {
  if (category === null) {
    return DEFAULT_BADGE;
  }
  const mapped = CATEGORY_BADGE_BY_NAME[category];
  if (mapped !== undefined) {
    return mapped;
  }
  return DEFAULT_BADGE;
}
