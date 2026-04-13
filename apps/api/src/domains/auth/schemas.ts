import { type Comrade, ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/shared';
import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.string().min(1).max(128).trim(),
  password: z.string().min(1).max(256),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const comradeOutputSchema: z.ZodType<Comrade> = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string(),
  role: z.nativeEnum(ComradeRole),
  onboardStatus: z.nativeEnum(ComradeOnboardStatus),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
});
