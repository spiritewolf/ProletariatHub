import { HubInventoryProductFrequency, HubListItemPriority } from '@proletariat-hub/types';
import { z } from 'zod';

export const HubListItemDisplayStatus = {
  ACTIVE: 'ACTIVE',
  CLAIMED: 'CLAIMED',
  PURCHASED: 'PURCHASED',
} as const;

export type HubListItemDisplayStatus =
  (typeof HubListItemDisplayStatus)[keyof typeof HubListItemDisplayStatus];

export const HUB_LIST_PRIORITY_LABEL: Record<HubListItemPriority, string> = {
  [HubListItemPriority.LOW]: 'Low',
  [HubListItemPriority.MEDIUM]: 'Med',
  [HubListItemPriority.HIGH]: 'High',
  [HubListItemPriority.URGENT]: 'Urgent',
};

export const HUB_INVENTORY_FREQUENCY_LABEL: Record<HubInventoryProductFrequency, string> = {
  [HubInventoryProductFrequency.ONE_TIME]: 'One-time',
  [HubInventoryProductFrequency.WEEKLY]: 'Weekly',
  [HubInventoryProductFrequency.BIWEEKLY]: 'Biweekly',
  [HubInventoryProductFrequency.MONTHLY]: 'Monthly',
  [HubInventoryProductFrequency.CUSTOM]: 'Custom',
};

export const addItemNewProductFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    brandName: z.string().nullable(),
    categoryId: z.string().uuid().nullable(),
    vendorId: z.string().uuid().nullable(),
    purchaseFrequency: z.enum([
      HubInventoryProductFrequency.ONE_TIME,
      HubInventoryProductFrequency.WEEKLY,
      HubInventoryProductFrequency.BIWEEKLY,
      HubInventoryProductFrequency.MONTHLY,
      HubInventoryProductFrequency.CUSTOM,
    ]),
    customFrequencyDays: z.preprocess((value) => {
      if (value === '' || value == null) {
        return null;
      }
      return Number(value);
    }, z.number().int().positive().nullable()),
    quantityInStock: z.preprocess((value) => {
      if (value === '' || value == null) {
        return 0;
      }
      return Number(value);
    }, z.number().min(0)),
  })
  .superRefine((data, ctx) => {
    if (data.purchaseFrequency === HubInventoryProductFrequency.CUSTOM) {
      if (data.customFrequencyDays == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a number of days for custom frequency',
          path: ['customFrequencyDays'],
        });
      }
    }
  });

export type AddItemNewProductFormValues = z.input<typeof addItemNewProductFormSchema>;
export type AddItemNewProductParsedValues = z.output<typeof addItemNewProductFormSchema>;
