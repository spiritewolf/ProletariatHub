import { z } from 'zod';
import { authenticatedComradeSchema } from './authenticated-comrade.js';

export const setupComradeRowSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.number(),
  notificationPhone: z.string().nullable(),
});

export type SetupComradeRow = z.infer<typeof setupComradeRowSchema>;

export const setupComradesListResponseSchema = z.object({
  comrades: z.array(setupComradeRowSchema),
});

export const setupCreateComradeResponseSchema = z.object({
  comrade: z.object({
    id: z.uuid(),
    username: z.string(),
    isAdmin: z.boolean(),
  }),
});

export const hubPatchResponseSchema = z.object({
  hub: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
});

export const setupCompleteResponseSchema = z.object({
  ok: z.literal(true),
  comrade: authenticatedComradeSchema,
});
