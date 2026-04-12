import { z } from 'zod';

const recruitLineEditorSchema = z.object({
  username: z.string(),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
});

export type RecruitLineEditorState = z.infer<typeof recruitLineEditorSchema>;

export const recruitSchema = recruitLineEditorSchema
  .transform((raw) => {
    const trim = (value: string | undefined): string => (value ?? '').trim();
    const username = trim(raw.username);
    const passwordTrimmed = raw.password === undefined ? '' : trim(raw.password);
    const phoneNumber = raw.phoneNumber === undefined ? '' : trim(raw.phoneNumber);
    const email = raw.email === undefined ? '' : trim(raw.email);
    const signalUsername = raw.signalUsername === undefined ? '' : trim(raw.signalUsername);
    const telegramUsername = raw.telegramUsername === undefined ? '' : trim(raw.telegramUsername);
    return {
      username,
      password: passwordTrimmed === '' ? undefined : passwordTrimmed,
      phoneNumber: phoneNumber === '' ? undefined : phoneNumber,
      email: email === '' ? '' : email,
      signalUsername: signalUsername === '' ? undefined : signalUsername,
      telegramUsername: telegramUsername === '' ? undefined : telegramUsername,
    };
  })
  .pipe(
    z.object({
      username: z.string().min(1, 'Username is required'),
      password: z.string().optional(),
      phoneNumber: z.string().optional(),
      email: z.union([z.literal(''), z.string().email()]).optional(),
      signalUsername: z.string().optional(),
      telegramUsername: z.string().optional(),
    }),
  );

export const setupWizardSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    hubName: z.string().min(1, 'Hub name is required'),
    recruits: z.array(recruitSchema),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SetupWizardFormValues = z.infer<typeof setupWizardSchema>;
export type RecruitFormValues = z.infer<typeof recruitSchema>;
