import { ComradeAvatarIconType } from '@proletariat-hub/types';
import { z } from 'zod';

const recruitAvatarIconSchema = z.enum([
  ComradeAvatarIconType.ATOM,
  ComradeAvatarIconType.CROWN,
  ComradeAvatarIconType.EGG_FRIED,
  ComradeAvatarIconType.HAND_FIST,
  ComradeAvatarIconType.MENU,
  ComradeAvatarIconType.PALETTE,
  ComradeAvatarIconType.SNAIL,
  ComradeAvatarIconType.USER,
]);

export const recruitSchema = z
  .object({
    username: z.string(),
    icon: recruitAvatarIconSchema.default(ComradeAvatarIconType.USER),
  })
  .transform((raw) => ({
    username: raw.username.trim(),
    icon: raw.icon,
  }))
  .pipe(
    z.object({
      username: z.string().min(1, 'Username is required'),
      icon: recruitAvatarIconSchema,
    }),
  );

export type RecruitFormValues = z.infer<typeof recruitSchema>;

export const setupWizardSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    email: z
      .union([z.string(), z.undefined(), z.null()])
      .transform((value): string | undefined => {
        if (value === null || value === undefined) {
          return undefined;
        }
        const trimmed = value.trim();
        if (trimmed === '') {
          return undefined;
        }
        return trimmed;
      })
      .pipe(z.string().email().optional()),
    signalUsername: z.string().optional(),
    telegramUsername: z.string().optional(),
    hubName: z.string().min(1, 'Hub name is required'),
    recruits: z.array(recruitSchema),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SetupWizardFormValues = z.input<typeof setupWizardSchema>;
