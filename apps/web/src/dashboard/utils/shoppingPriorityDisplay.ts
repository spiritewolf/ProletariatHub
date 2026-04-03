import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';

import { dashboardTheme } from '../dashboardTheme';

export enum ShoppingItemPriority {
  Urgent = 'urgent',
  Medium = 'medium',
  Low = 'low',
}

export const SHOPPING_PRIORITY_BADGE_STYLES: Record<
  ShoppingItemPriority,
  { bg: string; color: string }
> = {
  [ShoppingItemPriority.Urgent]: { bg: '#fef2f2', color: '#991b1b' },
  [ShoppingItemPriority.Medium]: { bg: '#fffbeb', color: '#92400e' },
  [ShoppingItemPriority.Low]: { bg: dashboardTheme.badgeMuted, color: '#4b5563' },
};

/** Badge uses contract priority string as visible text (lowercase in data). */
export const SHOPPING_PRIORITY_BADGE_TEXT: Record<ShoppingItemPriority, string> = {
  [ShoppingItemPriority.Urgent]: ShoppingItemPriority.Urgent,
  [ShoppingItemPriority.Medium]: ShoppingItemPriority.Medium,
  [ShoppingItemPriority.Low]: ShoppingItemPriority.Low,
};

const SHOPPING_PRIORITY_BY_VALUE: Record<
  DashboardShoppingItemWidget['priority'],
  ShoppingItemPriority
> = {
  urgent: ShoppingItemPriority.Urgent,
  medium: ShoppingItemPriority.Medium,
  low: ShoppingItemPriority.Low,
};

export function getShoppingItemPriority(
  priority: DashboardShoppingItemWidget['priority'],
): ShoppingItemPriority {
  return SHOPPING_PRIORITY_BY_VALUE[priority];
}

export function getShoppingPriorityBadgeStyles(priority: DashboardShoppingItemWidget['priority']): {
  bg: string;
  color: string;
} {
  return SHOPPING_PRIORITY_BADGE_STYLES[getShoppingItemPriority(priority)];
}

export function getShoppingPriorityBadgeText(
  priority: DashboardShoppingItemWidget['priority'],
): string {
  return SHOPPING_PRIORITY_BADGE_TEXT[getShoppingItemPriority(priority)];
}
