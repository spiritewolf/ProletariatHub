import { z } from 'zod';

export const ADD_ITEM_FREQUENCY = {
  ONE_TIME: 'ONE_TIME',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
} as const;

export type AddItemFrequency = (typeof ADD_ITEM_FREQUENCY)[keyof typeof ADD_ITEM_FREQUENCY];

export const ADD_ITEM_FREQUENCY_LABEL: Record<AddItemFrequency, string> = {
  [ADD_ITEM_FREQUENCY.ONE_TIME]: 'One-time',
  [ADD_ITEM_FREQUENCY.WEEKLY]: 'Weekly',
  [ADD_ITEM_FREQUENCY.BIWEEKLY]: 'Biweekly',
  [ADD_ITEM_FREQUENCY.MONTHLY]: 'Monthly',
};

export const ADD_ITEM_PRIORITY_FORM = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type AddItemPriorityForm =
  (typeof ADD_ITEM_PRIORITY_FORM)[keyof typeof ADD_ITEM_PRIORITY_FORM];

export const ADD_ITEM_PRIORITY_LABEL: Record<AddItemPriorityForm, string> = {
  LOW: 'Low',
  MEDIUM: 'Med',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const addItemNewProductFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional(),
  vendorName: z.string().optional(),
  frequency: z.enum([
    ADD_ITEM_FREQUENCY.ONE_TIME,
    ADD_ITEM_FREQUENCY.WEEKLY,
    ADD_ITEM_FREQUENCY.BIWEEKLY,
    ADD_ITEM_FREQUENCY.MONTHLY,
  ]),
  priority: z.enum([
    ADD_ITEM_PRIORITY_FORM.LOW,
    ADD_ITEM_PRIORITY_FORM.MEDIUM,
    ADD_ITEM_PRIORITY_FORM.HIGH,
    ADD_ITEM_PRIORITY_FORM.URGENT,
  ]),
  notes: z.string().optional(),
});

export type AddItemNewProductFormValues = z.infer<typeof addItemNewProductFormSchema>;

export type AddItemNewProductParsedValues = AddItemNewProductFormValues;
