import { type ShoppingItemRow, shoppingItemRowSchema } from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';

import type { shoppingListItems } from '../db/schema.js';

type ShoppingListItemRow = InferSelectModel<typeof shoppingListItems>;

export function serializeShoppingItemRow(row: ShoppingListItemRow): ShoppingItemRow {
  const candidate = {
    id: row.id,
    listId: row.listId,
    name: row.name,
    category: row.category,
    vendor: row.vendor,
    purchaseType: row.purchaseType,
    priority: row.priority,
    isOneTime: row.isOneTime,
    productCodeOrUrl: row.productCodeOrUrl,
    notes: row.notes,
    addedAt: row.addedAt,
    orderedAt: row.orderedAt,
    sortOrder: row.sortOrder,
  };
  return shoppingItemRowSchema.parse(candidate);
}
