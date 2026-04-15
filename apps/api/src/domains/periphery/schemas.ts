import type { Periphery } from '@proletariat-hub/types';
import { HubPeripheryCategory } from '@proletariat-hub/types';
import { z } from 'zod';

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
  avatarIcon: z.string().nullable().optional(),
  phoneNumber: optionalNullableString,
  email: z.union([z.null(), z.string().email()]).optional(),
});

export const updateOnePeripheryInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  peripheryCategory: peripheryCategorySchema.optional(),
  notes: optionalNullableString,
  birthDate: birthDateField,
  avatarIcon: z.string().nullable().optional(),
  phoneNumber: optionalNullableString,
  email: z.union([z.null(), z.string().email()]).optional(),
});

const peripherySettingsOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  birthDate: z.date().nullable(),
  avatarIcon: z.string().nullable(),
  avatarColor: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
});

export const peripheryOutputSchema: z.ZodType<Periphery> = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  peripheryCategory: peripheryCategorySchema,
  notes: z.string().nullable(),
  hubId: z.string().uuid(),
  createdById: z.string().uuid(),
  settings: peripherySettingsOutputSchema,
});

export type CreateOnePeripheryInput = z.infer<typeof createOnePeripheryInputSchema>;
export type UpdateOnePeripheryInput = z.infer<typeof updateOnePeripheryInputSchema>;
