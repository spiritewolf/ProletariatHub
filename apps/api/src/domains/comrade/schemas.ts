import {
  type Comrade,
  ComradeAvatarIconType,
  ComradeOnboardStatus,
  ComradeRole,
} from '@proletariat-hub/shared';
import { z } from 'zod';

const comradeSettingsOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatarIcon: z.nativeEnum(ComradeAvatarIconType).nullable(),
  avatarColor: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  signalUsername: z.string().nullable(),
  telegramUsername: z.string().nullable(),
});

export const comradeOutputSchema: z.ZodType<Comrade> = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string(),
  role: z.nativeEnum(ComradeRole),
  onboardStatus: z.nativeEnum(ComradeOnboardStatus),
  hubId: z.string().uuid().nullable().optional(),
  settings: comradeSettingsOutputSchema,
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
});

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

const recruitInputSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  icon: recruitAvatarIconSchema.default(ComradeAvatarIconType.USER),
});

export const completeAdminSetupInputSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    email: z
      .string()
      .optional()
      .transform((v) => {
        const trimmed = v?.trim();
        return trimmed === '' ? undefined : trimmed;
      })
      .pipe(z.string().email().optional()),
    signalUsername: z.string().optional(),
    telegramUsername: z.string().optional(),
    hubName: z.string().min(1, 'Hub name is required'),
    recruits: z.array(recruitInputSchema),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    const names = data.recruits.map((r) => r.username);
    if (new Set(names).size !== names.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Recruit usernames must be unique',
        path: ['recruits'],
      });
    }
  });

export const completeMemberSetupInputSchema = completeAdminSetupInputSchema;

export type CompleteAdminSetupInput = z.infer<typeof completeAdminSetupInputSchema>;
export type CompleteMemberSetupInput = z.infer<typeof completeMemberSetupInputSchema>;
