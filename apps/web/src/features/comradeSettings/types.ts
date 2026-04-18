import type { Periphery } from '@proletariat-hub/types';
import { ComradeAvatarIconType, HubPeripheryCategory } from '@proletariat-hub/types';
import { z } from 'zod';

import { PERIPHERY_FORM_DEFAULTS, PERIPHERY_PET_GLYPH_ICONS } from './constants';

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
      if (!password) {
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

export type ComradeSettingsFormValues = z.input<typeof comradeSettingsFormSchema>;
export type ComradeSettingsParsedValues = z.output<typeof comradeSettingsFormSchema>;
export type ComradeSettingsFormInput = z.input<typeof comradeSettingsFormSchema>;

const peripheryCategoryField = z.enum([HubPeripheryCategory.PERSON, HubPeripheryCategory.PET]);

export type PeripheryPetGlyphIcon = (typeof PERIPHERY_PET_GLYPH_ICONS)[number];

export const hubPeripheryDrawerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  peripheryCategory: peripheryCategoryField,
  birthDate: z
    .string()
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use a valid date or leave empty'),
  petAvatarIcon: z.string(),
});

export type HubPeripheryDrawerFormValues = z.infer<typeof hubPeripheryDrawerFormSchema>;

export function mapPeripheryToFormValues(periphery: Periphery): HubPeripheryDrawerFormValues {
  return {
    name: periphery.name,
    peripheryCategory: periphery.peripheryCategory,
    birthDate: periphery.settings.birthDate
      ? periphery.settings.birthDate.toISOString().slice(0, 10)
      : '',
    petAvatarIcon:
      periphery.peripheryCategory === HubPeripheryCategory.PET && periphery.settings.avatarIcon
        ? periphery.settings.avatarIcon
        : (PERIPHERY_FORM_DEFAULTS.petAvatarIcon ?? ComradeAvatarIconType.SNAIL),
  };
}
