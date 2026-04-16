import type { PrismaClient } from '@proletariat-hub/database';

import type {
  CreateOneHubInventoryProductInputData,
  CreateOneHubInventoryVendorInputData,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from './types';

export async function createOneHubInventoryProduct(params: {
  db: PrismaClient;
  where: { hubId: string };
  data: CreateOneHubInventoryProductInputData;
}): Promise<HubInventoryProductDbRecord> {
  return params.db.hubInventoryProduct.create({
    data: {
      hubId: params.where.hubId,
      createdById: params.data.createdById,
      name: params.data.name,
      brandName: params.data.brandName,
      categoryId: params.data.categoryId,
      vendorId: params.data.vendorId,
      purchaseFrequency: params.data.purchaseFrequency,
      customFrequencyDays: params.data.customFrequencyDays,
      notes: params.data.notes,
      quantityInStock: params.data.quantityInStock,
    },
  });
}

export async function createOneHubInventoryVendor(params: {
  db: PrismaClient;
  where: { hubId: string };
  data: CreateOneHubInventoryVendorInputData;
}): Promise<HubInventoryVendorDbRecord> {
  return params.db.hubInventoryVendor.create({
    data: {
      hubId: params.where.hubId,
      name: params.data.name,
      fulfillmentType: params.data.fulfillmentType,
    },
  });
}
