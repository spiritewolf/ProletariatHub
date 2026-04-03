import { z } from 'zod';

import { choreListItemSchema } from './chores.js';
import { dashboardDocsPreviewSchema } from './docs.js';
import { dashboardReminderRowSchema } from './reminders.js';
import { shoppingPrioritySchema, shoppingPurchaseTypeSchema } from './shopping.js';
import { todoListItemSchema } from './todos.js';

/** Open shopping line item for dashboard widgets (hub or personal list). */
export const dashboardShoppingItemWidgetSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: z.string().nullable(),
  priority: shoppingPrioritySchema,
  purchaseType: shoppingPurchaseTypeSchema,
  listName: z.string(),
});

export const dashboardComradeRowSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  isAdmin: z.boolean(),
});

export const dashboardSummarySchema = z.object({
  greeting: z.string(),
  today: z.string(),
  hubName: z.string(),
  /** Short status line for the top bar (e.g. shopping counts). */
  statusLine: z.string(),
  urgentOpenCount: z.number().int().nonnegative(),
  openShoppingCount: z.number().int().nonnegative(),
  hubShoppingItems: z.array(dashboardShoppingItemWidgetSchema),
  personalShoppingItems: z.array(dashboardShoppingItemWidgetSchema),
  comrades: z.array(dashboardComradeRowSchema),
  choresAssigned: z.array(choreListItemSchema),
  todosAssigned: z.array(todoListItemSchema),
  calendarPreview: z.array(dashboardReminderRowSchema),
  docsPreview: dashboardDocsPreviewSchema,
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type DashboardShoppingItemWidget = z.infer<typeof dashboardShoppingItemWidgetSchema>;
export type DashboardComradeRow = z.infer<typeof dashboardComradeRowSchema>;
