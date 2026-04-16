import {
  type HubInventoryProduct,
  type HubInventoryProductCategory,
  HubInventoryProductFrequency,
  HubInventoryStorageLocation,
  type HubInventoryVendor,
  HubInventoryVendorFulfillmentType,
} from '@proletariat-hub/types';

import { validateConstEnumType } from '../../shared/util/helpers';
import type {
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from './types';

function parseOptionalStorageLocation(value: string | null): HubInventoryStorageLocation | null {
  return value === null
    ? null
    : validateConstEnumType(HubInventoryStorageLocation, value, 'storage location');
}

export function parseHubInventoryProduct(record: HubInventoryProductDbRecord): HubInventoryProduct {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    archivedAt: record.archivedAt,
    name: record.name,
    brandName: record.brandName,
    description: record.description,
    productCode: record.productCode,
    productUrl: record.productUrl,
    purchaseFrequency: validateConstEnumType(
      HubInventoryProductFrequency,
      record.purchaseFrequency,
      'purchase frequency',
    ),
    customFrequencyDays: record.customFrequencyDays,
    notes: record.notes,
    quantityInStock: Number(record.quantityInStock),
    lastPurchasedAt: record.lastPurchasedAt,
    lastPurchasedById: record.lastPurchasedById,
    minStockThreshold: record.minStockThreshold !== null ? Number(record.minStockThreshold) : null,
    urgentStockThreshold:
      record.urgentStockThreshold !== null ? Number(record.urgentStockThreshold) : null,
    expiresAt: record.expiresAt,
    openedAt: record.openedAt,
    storageLocation: parseOptionalStorageLocation(record.storageLocation),
    storageLocationOpened: parseOptionalStorageLocation(record.storageLocationOpened),
    storageNotes: record.storageNotes,
    shelfLifeDays: record.shelfLifeDays,
    shelfLifeOpenedDays: record.shelfLifeOpenedDays,
    categoryId: record.categoryId,
    vendorId: record.vendorId,
    hubId: record.hubId,
    createdById: record.createdById,
  };
}

export function parseHubInventoryProductCategory(
  record: HubInventoryProductCategoryDbRecord,
): HubInventoryProductCategory {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    name: record.name,
    hubId: record.hubId,
  };
}

export function parseHubInventoryVendor(record: HubInventoryVendorDbRecord): HubInventoryVendor {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    name: record.name,
    website: record.website,
    fulfillmentType: validateConstEnumType(
      HubInventoryVendorFulfillmentType,
      record.fulfillmentType,
      'vendor fulfillment type',
    ),
    notes: record.notes,
    hubId: record.hubId,
  };
}
