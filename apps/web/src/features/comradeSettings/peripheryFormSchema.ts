import { ComradeAvatarIconType, HubPeripheryCategory } from '@proletariat-hub/types';
import { z } from 'zod';

const peripheryCategoryField = z.enum([HubPeripheryCategory.PERSON, HubPeripheryCategory.PET]);

export const PERIPHERY_PET_GLYPH_ICONS = [
  ComradeAvatarIconType.CAT,
  ComradeAvatarIconType.DOG,
  ComradeAvatarIconType.FISH,
  ComradeAvatarIconType.SNAIL,
] as const;

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
