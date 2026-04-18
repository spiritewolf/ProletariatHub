import { HubListItemPriority } from '@proletariat-hub/types';
import type { LucideIcon } from 'lucide-react';
import {
  Beef,
  Carrot,
  CupSoda,
  Home,
  Milk,
  Package,
  ShoppingBasket,
  SoapDispenserDroplet,
} from 'lucide-react';

type CategoryBadgeVisual = string | { base: string; _dark: string };

export type CategoryBadgeStyle = {
  bg: CategoryBadgeVisual;
  color: CategoryBadgeVisual;
};

export const PRIORITY_CONFIG = {
  [HubListItemPriority.URGENT]: { bg: 'error.subtle', color: 'error.fg' },
  [HubListItemPriority.HIGH]: { bg: 'warning.subtle', color: 'warning.fg' },
  [HubListItemPriority.MEDIUM]: {
    bg: 'hubList.priorityMedium.bg',
    color: 'hubList.priorityMedium.fg',
  },
  [HubListItemPriority.LOW]: { bg: 'hubList.priorityLow.bg', color: 'hubList.priorityLow.fg' },
} as const;

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

const FALLBACK_ICON: LucideIcon = Package;

const ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  Dairy: Milk,
  Cleaning: SoapDispenserDroplet,
  Produce: Carrot,
  Household: Home,
  Beverages: CupSoda,
  Pantry: ShoppingBasket,
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

export function getCategorySearchResultIcon(category: string | null): LucideIcon {
  if (category === null) {
    return FALLBACK_ICON;
  }
  const mapped = ICON_BY_CATEGORY[category];
  if (mapped !== undefined) {
    return mapped;
  }
  return Beef;
}
