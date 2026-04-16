import type {
  HubInventoryProduct,
  HubInventoryProductCategory,
  HubInventoryVendor,
} from '@proletariat-hub/types';
import {
  HubInventoryProductFrequency,
  HubInventoryStorageLocation,
  HubInventoryVendorFulfillmentType,
  HubListItemPriority,
} from '@proletariat-hub/types';
import { z } from 'zod';

const hubInventoryProductFrequencySchema = z.enum([
  HubInventoryProductFrequency.ONE_TIME,
  HubInventoryProductFrequency.WEEKLY,
  HubInventoryProductFrequency.BIWEEKLY,
  HubInventoryProductFrequency.MONTHLY,
  HubInventoryProductFrequency.CUSTOM,
]);

const hubInventoryStorageLocationSchema = z.enum([
  HubInventoryStorageLocation.PANTRY,
  HubInventoryStorageLocation.FRIDGE,
  HubInventoryStorageLocation.FREEZER,
  HubInventoryStorageLocation.BEDROOM,
  HubInventoryStorageLocation.BATHROOM,
  HubInventoryStorageLocation.LAUNDRY,
  HubInventoryStorageLocation.GARAGE,
  HubInventoryStorageLocation.OTHER,
]);

const hubInventoryVendorFulfillmentTypeSchema = z.enum([
  HubInventoryVendorFulfillmentType.ONLINE,
  HubInventoryVendorFulfillmentType.IN_STORE,
  HubInventoryVendorFulfillmentType.BOTH,
]);

export const hubInventoryProductOutputSchema: z.ZodType<HubInventoryProduct> = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().nullable(),
  name: z.string(),
  brandName: z.string().nullable(),
  description: z.string().nullable(),
  productCode: z.string().nullable(),
  productUrl: z.string().nullable(),
  purchaseFrequency: hubInventoryProductFrequencySchema,
  customFrequencyDays: z.number().nullable(),
  notes: z.string().nullable(),
  quantityInStock: z.number(),
  lastPurchasedAt: z.date().nullable(),
  lastPurchasedById: z.string().uuid().nullable(),
  minStockThreshold: z.number().nullable(),
  urgentStockThreshold: z.number().nullable(),
  expiresAt: z.date().nullable(),
  openedAt: z.date().nullable(),
  storageLocation: hubInventoryStorageLocationSchema.nullable(),
  storageLocationOpened: hubInventoryStorageLocationSchema.nullable(),
  storageNotes: z.string().nullable(),
  shelfLifeDays: z.number().nullable(),
  shelfLifeOpenedDays: z.number().nullable(),
  categoryId: z.string().uuid().nullable(),
  vendorId: z.string().uuid().nullable(),
  hubId: z.string().uuid(),
  createdById: z.string().uuid(),
});

export const hubInventoryProductCategoryOutputSchema: z.ZodType<HubInventoryProductCategory> =
  z.object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string(),
    hubId: z.string().uuid(),
  });

export const hubInventoryVendorOutputSchema: z.ZodType<HubInventoryVendor> = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  website: z.string().nullable(),
  fulfillmentType: hubInventoryVendorFulfillmentTypeSchema,
  notes: z.string().nullable(),
  hubId: z.string().uuid(),
});

export const findManyHubInventoryProductsInputSchema = z
  .object({
    searchText: z.string().nullish(),
  })
  .optional();

const hubListItemPriorityForProductCreateSchema = z.enum([
  HubListItemPriority.URGENT,
  HubListItemPriority.HIGH,
  HubListItemPriority.MEDIUM,
  HubListItemPriority.LOW,
]);

export const createOneProductInputSchema = z
  .object({
    name: z.string().min(1),
    brandName: z.string().nullable(),
    categoryId: z.string().uuid().nullable(),
    vendorId: z.string().uuid().nullable(),
    purchaseFrequency: hubInventoryProductFrequencySchema,
    customFrequencyDays: z.number().int().positive().nullable(),
    quantityInStock: z.number().min(0).default(0),
    priority: hubListItemPriorityForProductCreateSchema,
    quantity: z.number().min(1).default(1),
    notes: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.purchaseFrequency === HubInventoryProductFrequency.CUSTOM) {
      if (data.customFrequencyDays == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom frequency requires a number of days',
          path: ['customFrequencyDays'],
        });
      }
    }
  });

export const createOneVendorInputSchema = z.object({
  name: z.string().min(1),
  fulfillmentType: hubInventoryVendorFulfillmentTypeSchema.default(
    HubInventoryVendorFulfillmentType.BOTH,
  ),
});
