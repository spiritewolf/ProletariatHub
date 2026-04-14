import { z } from 'zod';

const optionalEmailField = z
  .string()
  .transform((v) => (v.trim() === '' ? undefined : v.trim()))
  .pipe(z.string().email().optional());

const birthDateYmd = z.string().refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), {
  message: 'Use a valid date',
});

export const comradeSettingsFormSchema = z
  .object({
    username: z.string().min(1),
    birthDate: birthDateYmd,
    phoneNumber: z.string().optional(),
    email: optionalEmailField,
    signalUsername: z.string().optional(),
    telegramUsername: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const password = data.newPassword;
      if (password === undefined || password === '') {
        return true;
      }
      return password.length >= 8;
    },
    { message: 'Password must be at least 8 characters', path: ['newPassword'] },
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ComradeSettingsFormInput = z.input<typeof comradeSettingsFormSchema>;
