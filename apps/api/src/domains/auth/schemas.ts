import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().min(1).max(256),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
