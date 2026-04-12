import { ComradeIconType } from '@proletariat-hub/web/shared';
import { z } from 'zod';

const recruitAvatarIconSchema = z.enum([
  ComradeIconType.ATOM,
  ComradeIconType.CROWN,
  ComradeIconType.EGG_FRIED,
  ComradeIconType.HAND_FIST,
  ComradeIconType.MENU,
  ComradeIconType.PALETTE,
  ComradeIconType.SNAIL,
  ComradeIconType.USER,
]);

export const recruitSchema = z
  .object({
    username: z.string(),
    icon: recruitAvatarIconSchema.default(ComradeIconType.USER),
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
      .string()
      .optional()
      .refine(
        (value) => {
          const trimmed = (value ?? '').trim();
          return trimmed === '' || z.string().email().safeParse(trimmed).success;
        },
        { message: 'Invalid email', path: ['email'] },
      ),
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
