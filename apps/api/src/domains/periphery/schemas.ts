import type { Periphery } from '@proletariat-hub/types';
import { ComradeAvatarIconType, HubPeripheryCategory } from '@proletariat-hub/types';
import { z } from 'zod';

const peripheryAvatarIconSchema = z.enum([
  ComradeAvatarIconType.ATOM,
  ComradeAvatarIconType.CROWN,
  ComradeAvatarIconType.EGG_FRIED,
  ComradeAvatarIconType.HAND_FIST,
  ComradeAvatarIconType.MENU,
  ComradeAvatarIconType.PALETTE,
  ComradeAvatarIconType.SNAIL,
  ComradeAvatarIconType.USER,
]);

const peripheryCategorySchema = z.enum([HubPeripheryCategory.PERSON, HubPeripheryCategory.PET]);

const birthDateValue = z.union([
  z.null(),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform((v) => new Date(`${v}T12:00:00.000Z`)),
]);

const birthDateField = birthDateValue.optional();

const optionalNullableString = z.union([z.null(), z.string()]).optional();

export const createOnePeripheryInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  peripheryCategory: peripheryCategorySchema,
  notes: optionalNullableString,
  birthDate: birthDateValue,
  avatarIcon: z.union([z.null(), peripheryAvatarIconSchema]).optional(),
  phoneNumber: optionalNullableString,
  email: z.union([z.null(), z.string().email()]).optional(),
});

export const updateOnePeripheryInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  peripheryCategory: peripheryCategorySchema.optional(),
  notes: optionalNullableString,
  birthDate: birthDateField,
  avatarIcon: z.union([z.null(), peripheryAvatarIconSchema]).optional(),
  phoneNumber: optionalNullableString,
  email: z.union([z.null(), z.string().email()]).optional(),
});

const peripherySettingsOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  birthDate: z.coerce.date().nullable(),
  avatarIcon: peripheryAvatarIconSchema.nullable(),
  avatarColor: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
});

export const peripheryOutputSchema: z.ZodType<Periphery> = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  peripheryCategory: peripheryCategorySchema,
  notes: z.string().nullable(),
  hubId: z.string().uuid(),
  createdById: z.string().uuid(),
  settings: peripherySettingsOutputSchema,
});

export type CreateOnePeripheryInput = z.infer<typeof createOnePeripheryInputSchema>;
export type UpdateOnePeripheryInput = z.infer<typeof updateOnePeripheryInputSchema>;
