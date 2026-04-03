import { z } from 'zod';

export const calendarEventCategorySchema = z.enum([
  'birthday',
  'medical',
  'dental',
  'appointment',
  'annual_exam',
  'general_reminder',
]);

export const calendarRecurrenceSchema = z.enum(['none', 'yearly', 'monthly', 'custom']);

export const calendarEventStatusSchema = z.enum(['upcoming', 'completed', 'snoozed']);

export const dashboardReminderRowSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  category: calendarEventCategorySchema,
  eventDate: z.string(),
  eventTime: z.string().nullable(),
  status: calendarEventStatusSchema,
});

export const reminderListItemSchema = dashboardReminderRowSchema.extend({
  notes: z.string().nullable(),
  recurrence: calendarRecurrenceSchema,
});

export const remindersListResponseSchema = z.object({
  reminders: z.array(reminderListItemSchema),
});

export const createReminderBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: calendarEventCategorySchema,
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventTime: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.null()]).optional(),
  recurrence: calendarRecurrenceSchema.optional().default('none'),
  notes: z.string().trim().max(5000).optional(),
  assignedComradeIds: z.array(z.uuid()).optional().default([]),
});

export const createReminderResponseSchema = z.object({
  reminder: reminderListItemSchema,
});

export const completeReminderResponseSchema = z.object({
  reminder: reminderListItemSchema,
});

export type DashboardReminderRow = z.infer<typeof dashboardReminderRowSchema>;
export type ReminderListItem = z.infer<typeof reminderListItemSchema>;
export type CreateReminderBody = z.infer<typeof createReminderBodySchema>;
