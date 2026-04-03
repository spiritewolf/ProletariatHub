import { z } from 'zod';

export const choreFrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'custom']);

export const choreListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  frequency: choreFrequencySchema,
  assignedComradeId: z.uuid(),
  assigneeUsername: z.string(),
  lastCompletedAt: z.number().int().nullable(),
  nextDueAt: z.number().int().nullable(),
  annoyingModeEnabled: z.boolean(),
});

export const choresListResponseSchema = z.object({
  chores: z.array(choreListItemSchema),
});

export const createChoreBodySchema = z.object({
  title: z.string().trim().min(1).max(500),
  description: z.string().trim().max(2000).optional(),
  assignedComradeId: z.uuid(),
  frequency: choreFrequencySchema.optional(),
  annoyingModeEnabled: z.boolean().optional(),
});

export const createChoreResponseSchema = z.object({
  chore: choreListItemSchema,
});

export const completeChoreBodySchema = z.object({
  notes: z.string().trim().max(2000).optional(),
});

export const completeChoreResponseSchema = z.object({
  chore: choreListItemSchema,
});

export type ChoreListItem = z.infer<typeof choreListItemSchema>;
export type CreateChoreBody = z.infer<typeof createChoreBodySchema>;
