import type { HubList, HubListItem } from '@proletariat-hub/types';
import { HubListItemPriority, HubListItemStatus } from '@proletariat-hub/types';
import { z } from 'zod';

const hubListItemStatusSchema = z.enum([
  HubListItemStatus.ACTIVE,
  HubListItemStatus.CLAIMED,
  HubListItemStatus.PURCHASED,
]);

const hubListItemPrioritySchema = z.enum([
  HubListItemPriority.URGENT,
  HubListItemPriority.HIGH,
  HubListItemPriority.MEDIUM,
  HubListItemPriority.LOW,
]);

const hubListComradeSnippetSchema = z.object({
  username: z.string(),
  displayInitial: z.string(),
});

export const hubListItemOutputSchema: z.ZodType<HubListItem> = z.object({
  id: z.string().uuid(),
  status: hubListItemStatusSchema,
  priority: hubListItemPrioritySchema,
  quantity: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  productId: z.string().uuid(),
  productName: z.string(),
  productBrand: z.string().nullable(),
  vendorName: z.string().nullable(),
  categoryName: z.string().nullable(),
  claimedBy: hubListComradeSnippetSchema.nullable(),
  purchasedBy: hubListComradeSnippetSchema.nullable(),
  claimedAt: z.date().nullable(),
});

export const hubListOutputSchema: z.ZodType<HubList> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  items: z.array(hubListItemOutputSchema),
});

export const createOneListItemInputSchema = z.object({
  productId: z.string().uuid(),
  priority: hubListItemPrioritySchema.default(HubListItemPriority.MEDIUM),
  quantity: z.number().nullable().default(null),
  notes: z.string().nullable().default(null),
});

export const claimOneListItemInputSchema = z.object({
  listItemId: z.string().uuid(),
});

export const claimManyListItemsInputSchema = z.object({
  listItemIds: z.array(z.string().uuid()).nonempty(),
});

export const unclaimOneListItemInputSchema = z.object({
  listItemId: z.string().uuid(),
});

export const unclaimManyListItemsInputSchema = z.object({
  listItemIds: z.array(z.string().uuid()).nonempty(),
});
