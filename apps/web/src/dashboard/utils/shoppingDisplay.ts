import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';
import { ShoppingItemPriority } from './shoppingPriorityDisplay';

export enum ShoppingPurchaseChannel {
  Online = 'online',
  InPerson = 'in_person',
  Either = 'either',
}

export const SHOPPING_PURCHASE_CHANNEL_LABEL: Record<ShoppingPurchaseChannel, string> = {
  [ShoppingPurchaseChannel.Online]: 'Online',
  [ShoppingPurchaseChannel.InPerson]: 'In store',
  [ShoppingPurchaseChannel.Either]: 'Either',
};

export function getShoppingPurchaseChannelLabel(
  purchaseType: DashboardShoppingItemWidget['purchaseType'],
): string {
  return SHOPPING_PURCHASE_CHANNEL_LABEL[purchaseType as ShoppingPurchaseChannel];
}

export enum ShoppingCategoryGroupFallback {
  General = 'General',
}

export type ShoppingCategoryGroup = {
  category: string;
  items: DashboardShoppingItemWidget[];
};

export function groupDashboardShoppingItemsByCategory(
  items: DashboardShoppingItemWidget[],
): ShoppingCategoryGroup[] {
  const categoryOrder: string[] = [];
  const itemsByCategory = new Map<string, DashboardShoppingItemWidget[]>();
  for (const item of items) {
    const trimmed = item.category?.trim();
    const categoryKey =
      trimmed && trimmed.length > 0 ? trimmed : ShoppingCategoryGroupFallback.General;
    if (!itemsByCategory.has(categoryKey)) {
      itemsByCategory.set(categoryKey, []);
      categoryOrder.push(categoryKey);
    }
    itemsByCategory.get(categoryKey)!.push(item);
  }
  return categoryOrder.map((category) => ({
    category,
    items: itemsByCategory.get(category)!,
  }));
}

export function formatShoppingWidgetRowMeta(item: DashboardShoppingItemWidget): string {
  const purchaseLabel = getShoppingPurchaseChannelLabel(item.purchaseType);
  return `${item.listName} · ${purchaseLabel}`;
}

export function filterUrgentShoppingItems(
  items: DashboardShoppingItemWidget[],
): DashboardShoppingItemWidget[] {
  return items.filter((item) => item.priority === ShoppingItemPriority.Urgent);
}
