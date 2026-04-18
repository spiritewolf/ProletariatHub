import { HubInventoryProductFrequency, HubListItemPriority } from '@proletariat-hub/types';
import { z } from 'zod';

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
    purchaseFrequency: z.nativeEnum(HubInventoryProductFrequency),
    customFrequencyDays: z.preprocess((value) => {
      if (value === '' || !value) {
        return null;
      }
      return Number(value);
    }, z.number().int().positive().nullable()),
    quantityInStock: z.preprocess((value) => {
      if (value === '' || !value) {
        return 0;
      }
      return Number(value);
    }, z.number().min(0)),
    notes: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.purchaseFrequency === HubInventoryProductFrequency.CUSTOM) {
      if (!data.customFrequencyDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a number of days for custom frequency',
          path: ['customFrequencyDays'],
        });
      }
    }
  });

export type AddItemNewProductFormInputValues = z.input<typeof addItemNewProductFormSchema>;
export type AddItemNewProductFormValues = z.output<typeof addItemNewProductFormSchema>;
