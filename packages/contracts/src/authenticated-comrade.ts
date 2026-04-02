import { z } from 'zod';

/** Comrade + hub context returned to the client after auth (no secrets). */
export const authenticatedComradeSchema = z.object({
  id: z.uuid(),
  username: z.string().min(1),
  hubId: z.uuid(),
  hubName: z.string().min(1),
  isAdmin: z.boolean(),
  mustChangePassword: z.boolean(),
  hasCompletedSetup: z.boolean(),
});

export type AuthenticatedComrade = z.infer<typeof authenticatedComradeSchema>;

export const sessionResponseSchema = z.object({
  comrade: authenticatedComradeSchema,
});

export const loginSuccessResponseSchema = z.object({
  ok: z.literal(true),
  comrade: authenticatedComradeSchema,
});

export const accountPatchResponseSchema = z.object({
  comrade: authenticatedComradeSchema,
});
