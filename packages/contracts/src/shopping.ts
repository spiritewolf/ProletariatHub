import { z } from 'zod';

export const shoppingListKindSchema = z.enum(['hub', 'personal']);

export const shoppingPrioritySchema = z.enum(['urgent', 'medium', 'low']);

export const shoppingPurchaseTypeSchema = z.enum(['online', 'in_person', 'either']);

export const shoppingListRowSchema = z.object({
  id: z.uuid(),
  hubId: z.uuid(),
  name: z.string(),
  listKind: shoppingListKindSchema,
  ownerComradeId: z.uuid().nullable(),
  itemCount: z.number().int().nonnegative(),
});

export const shoppingListsResponseSchema = z.object({
  lists: z.array(shoppingListRowSchema),
});

export const shoppingItemRowSchema = z.object({
  id: z.uuid(),
  listId: z.uuid(),
  name: z.string(),
  category: z.string().nullable(),
  vendor: z.string().nullable(),
  purchaseType: shoppingPurchaseTypeSchema,
  priority: shoppingPrioritySchema,
  isOneTime: z.boolean(),
  productCodeOrUrl: z.string().nullable(),
  notes: z.string().nullable(),
  addedAt: z.number().int(),
  orderedAt: z.number().int().nullable(),
  sortOrder: z.number().int(),
});

export const shoppingItemsResponseSchema = z.object({
  items: z.array(shoppingItemRowSchema),
});

export const shoppingItemSingleResponseSchema = z.object({
  item: shoppingItemRowSchema,
});

/** Same shape as create response; kept for call-site clarity. */
export const createShoppingItemResponseSchema = shoppingItemSingleResponseSchema;

export const createShoppingItemBodySchema = z.object({
  name: z.string().trim().min(1, 'Item name is required'),
  category: z.string().trim().optional(),
  priority: shoppingPrioritySchema.optional(),
  purchaseType: shoppingPurchaseTypeSchema.optional(),
  isOneTime: z.boolean().optional(),
  notes: z.string().trim().optional(),
});

/** POST mark-ordered: empty JSON object `{}`. */
export const markShoppingItemOrderedBodySchema = z.object({});

/** POST mark-reopened: empty JSON object `{}` — clears ordered state. */
export const markShoppingItemReopenedBodySchema = z.object({});

/** Query `status` for GET list items (default: open). */
export const shoppingItemsListStatusSchema = z.enum(['open', 'ordered', 'all']);

export const shoppingItemsQuerySchema = z.object({
  status: shoppingItemsListStatusSchema.optional(),
});

export type ShoppingItemsListStatus = z.infer<typeof shoppingItemsListStatusSchema>;

export type ShoppingListRow = z.infer<typeof shoppingListRowSchema>;
export type ShoppingItemRow = z.infer<typeof shoppingItemRowSchema>;
