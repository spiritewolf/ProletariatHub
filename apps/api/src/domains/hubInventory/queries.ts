import type { PrismaClient } from '@proletariat-hub/database';

import type {
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from './types';

export async function findManyHubInventoryProducts(params: {
  db: PrismaClient;
  where: { hubId: string; searchText?: string | null };
}): Promise<HubInventoryProductDbRecord[]> {
  const { hubId, searchText } = params.where;

  return params.db.hubInventoryProduct.findMany({
    where: {
      hubId,
      archivedAt: null,
      name: searchText ? { contains: searchText, mode: 'insensitive' } : undefined,
    },
    orderBy: { name: 'asc' },
  });
}

export async function findManyHubInventoryProductCategories(params: {
  db: PrismaClient;
  where: { hubId: string };
}): Promise<HubInventoryProductCategoryDbRecord[]> {
  return params.db.hubInventoryProductCategory.findMany({
    where: { hubId: params.where.hubId },
    orderBy: { name: 'asc' },
  });
}

export async function findManyHubInventoryVendors(params: {
  db: PrismaClient;
  where: { hubId: string };
}): Promise<HubInventoryVendorDbRecord[]> {
  return params.db.hubInventoryVendor.findMany({
    where: { hubId: params.where.hubId },
    orderBy: { name: 'asc' },
  });
}
