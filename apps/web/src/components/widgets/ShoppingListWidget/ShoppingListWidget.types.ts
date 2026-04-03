import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';

export type ShoppingListWidgetMode = 'grouped' | 'flat';

export type ShoppingListWidgetProps = {
  items: DashboardShoppingItemWidget[];
  emptyText?: string;
  mode?: ShoppingListWidgetMode;
};

export type ShoppingCategoryGroupModel = {
  category: string;
  items: DashboardShoppingItemWidget[];
};
