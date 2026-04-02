import { z } from 'zod';

const PASSWORD_MIN = 8;

export const loginBodySchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const accountPatchBodySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().optional(),
    newUsername: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.newPassword !== undefined &&
      data.newPassword.length > 0 &&
      data.newPassword.length < PASSWORD_MIN
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `New password must be at least ${PASSWORD_MIN} characters`,
        path: ['newPassword'],
      });
    }
  });

export type AccountPatchBody = z.infer<typeof accountPatchBodySchema>;

export const hubPatchBodySchema = z.object({
  name: z.string().trim().min(1, 'Hub name is required'),
});

export type HubPatchBody = z.infer<typeof hubPatchBodySchema>;

export const setupComradeBodySchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().trim().optional(),
  /** Empty or omitted becomes null on the server. */
  notificationPhone: z.string().trim().max(40).optional(),
});

export type SetupComradeBody = z.infer<typeof setupComradeBodySchema>;
