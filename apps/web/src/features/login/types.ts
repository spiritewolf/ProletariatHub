import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string(),
});

export type LoginFormState = z.infer<typeof loginFormSchema>;
