import { ComradeAvatarIconType, type ComradeSettingsConfig } from '@proletariat-hub/types';
import { z } from 'zod';

const birthDateValue = z.union([
  z.null(),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform((v) => new Date(`${v}T12:00:00.000Z`)),
]);

const birthDateField = birthDateValue.optional();

export const updateComradeSettingsInputSchema = z
  .object({
    email: z.union([z.null(), z.string().email()]).optional(),
    phoneNumber: z.union([z.null(), z.string()]).optional(),
    signalUsername: z.union([z.null(), z.string()]).optional(),
    telegramUsername: z.union([z.null(), z.string()]).optional(),
    birthDate: birthDateField,
    newPassword: z.union([z.literal(''), z.string()]).optional(),
    confirmPassword: z.union([z.literal(''), z.string()]).optional(),
  })
  .refine((data) => !data.newPassword || data.newPassword === '' || data.newPassword.length >= 8, {
    message: 'Password must be at least 8 characters',
    path: ['newPassword'],
  })
  .refine(
    (data) =>
      !data.newPassword || data.newPassword === '' || data.newPassword === data.confirmPassword,
    { message: "Passwords don't match", path: ['confirmPassword'] },
  );

export const comradeSettingsConfigOutputSchema: z.ZodType<ComradeSettingsConfig> = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  birthDate: z.coerce.date().nullable(),
  avatarIcon: z.nativeEnum(ComradeAvatarIconType).nullable(),
  avatarColor: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  signalUsername: z.string().nullable(),
  telegramUsername: z.string().nullable(),
});

export type UpdateComradeSettingsInput = z.infer<typeof updateComradeSettingsInputSchema>;
